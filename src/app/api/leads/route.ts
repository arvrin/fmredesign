/**
 * Lead Management API Routes
 * Handles CRUD operations for leads with Google Sheets integration
 */

import { NextRequest, NextResponse } from 'next/server';
import { leadService } from '@/lib/admin/lead-service';
import type { LeadInput, LeadUpdate, LeadFilters, LeadSortOptions } from '@/lib/admin/lead-types';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';

// GET /api/leads - Fetch leads with optional filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Parse filters from query parameters
    const filters: LeadFilters = {};
    
    if (searchParams.get('status')) {
      filters.status = searchParams.get('status')?.split(',') as any[];
    }
    
    if (searchParams.get('priority')) {
      filters.priority = searchParams.get('priority')?.split(',') as any[];
    }
    
    if (searchParams.get('source')) {
      filters.source = searchParams.get('source')?.split(',') as any[];
    }
    
    if (searchParams.get('projectType')) {
      filters.projectType = searchParams.get('projectType')?.split(',') as any[];
    }
    
    if (searchParams.get('budgetRange')) {
      filters.budgetRange = searchParams.get('budgetRange')?.split(',') as any[];
    }
    
    if (searchParams.get('companySize')) {
      filters.companySize = searchParams.get('companySize')?.split(',') as any[];
    }
    
    if (searchParams.get('assignedTo')) {
      filters.assignedTo = searchParams.get('assignedTo')?.split(',');
    }
    
    if (searchParams.get('tags')) {
      filters.tags = searchParams.get('tags')?.split(',');
    }
    
    if (searchParams.get('search')) {
      filters.searchQuery = searchParams.get('search')!;
    }
    
    // Parse date range
    if (searchParams.get('startDate') && searchParams.get('endDate')) {
      filters.dateRange = {
        start: new Date(searchParams.get('startDate')!),
        end: new Date(searchParams.get('endDate')!)
      };
    }
    
    // Parse sorting
    let sort: LeadSortOptions | undefined;
    if (searchParams.get('sortBy')) {
      sort = {
        field: searchParams.get('sortBy') as any,
        direction: (searchParams.get('sortDirection') as 'asc' | 'desc') || 'desc'
      };
    }
    
    const leads = await leadService.getLeads(filters, sort);
    
    return NextResponse.json({
      success: true,
      data: leads,
      total: leads.length
    });
    
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch leads',
      },
      { status: 500 }
    );
  }
}

// POST /api/leads - Create new lead
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = getClientIp(request);
    if (!rateLimit(clientIp, 5)) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'email', 'company', 'projectType', 'projectDescription', 'budgetRange', 'timeline', 'primaryChallenge', 'companySize'];
    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          missingFields
        },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create lead input object (strip HTML tags from text inputs)
    const stripHtml = (str: string) => str.replace(/<[^>]*>/g, '');
    const leadInput: LeadInput = {
      name: stripHtml(body.name.trim()),
      email: body.email.trim().toLowerCase(),
      phone: body.phone?.trim(),
      company: stripHtml(body.company.trim()),
      website: body.website?.trim(),
      jobTitle: body.jobTitle ? stripHtml(body.jobTitle.trim()) : undefined,
      companySize: body.companySize,
      industry: body.industry,
      projectType: body.projectType,
      projectDescription: stripHtml(body.projectDescription.trim()),
      budgetRange: body.budgetRange,
      timeline: body.timeline,
      primaryChallenge: stripHtml(body.primaryChallenge.trim()),
      additionalChallenges: body.additionalChallenges?.filter((c: string) => c.trim()).map((c: string) => stripHtml(c)),
      specificRequirements: body.specificRequirements ? stripHtml(body.specificRequirements.trim()) : undefined,
      source: body.source || 'website_form',
      customFields: body.customFields || {}
    };
    
    // Create the lead
    const lead = await leadService.createLead(leadInput);
    
    // Send notification email (placeholder)
    try {
      await sendLeadNotification(lead);
    } catch (notificationError) {
      console.error('Failed to send notification:', notificationError);
      // Don't fail the request if notification fails
    }
    
    return NextResponse.json({
      success: true,
      data: lead,
      message: 'Lead created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create lead',
      },
      { status: 500 }
    );
  }
}

// PUT /api/leads - Update lead (requires lead ID in body)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }
    
    // Extract update data (remove id from update object)
    const { id, ...updateData } = body;
    const leadUpdate: LeadUpdate = updateData;
    
    const updatedLead = await leadService.updateLead(id, leadUpdate);
    
    if (!updatedLead) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update lead',
      },
      { status: 500 }
    );
  }
}

// Helper function to send lead notifications
async function sendLeadNotification(lead: any) {
  try {
    // In a real implementation, this would send:
    // 1. Email notification to the team
    // 2. Slack notification
    // 3. Auto-response email to the lead
    
    
    // Placeholder for actual notification implementation
    // await emailService.sendTeamNotification(lead);
    // await slackService.sendLeadAlert(lead);
    // await emailService.sendAutoResponse(lead);
    
  } catch (error) {
    console.error('Error sending lead notification:', error);
    throw error;
  }
}