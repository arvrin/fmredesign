/**
 * Lead Management API Routes
 * Handles CRUD operations for leads (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { calculateLeadScore, determineLeadPriority, toCamelCaseKeys } from '@/lib/supabase-utils';
import type { LeadInput, LeadUpdate } from '@/lib/admin/lead-types';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { createLeadSchema, validateBody } from '@/lib/validations/schemas';
import { notifyTeam, newLeadEmail } from '@/lib/email/send';
import { logAuditEvent, getAuditUser, getClientIP } from '@/lib/admin/audit-log';

// GET /api/leads - Fetch leads with optional filtering and sorting
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;

    const supabase = getSupabaseAdmin();
    let query = supabase.from('leads').select('*');

    // Apply Supabase-level filters
    const statusFilter = searchParams.get('status');
    if (statusFilter) {
      query = query.in('status', statusFilter.split(','));
    }

    const priorityFilter = searchParams.get('priority');
    if (priorityFilter) {
      query = query.in('priority', priorityFilter.split(','));
    }

    const sourceFilter = searchParams.get('source');
    if (sourceFilter) {
      query = query.in('source', sourceFilter.split(','));
    }

    const projectTypeFilter = searchParams.get('projectType');
    if (projectTypeFilter) {
      query = query.in('project_type', projectTypeFilter.split(','));
    }

    const budgetRangeFilter = searchParams.get('budgetRange');
    if (budgetRangeFilter) {
      query = query.in('budget_range', budgetRangeFilter.split(','));
    }

    const companySizeFilter = searchParams.get('companySize');
    if (companySizeFilter) {
      query = query.in('company_size', companySizeFilter.split(','));
    }

    const assignedToFilter = searchParams.get('assignedTo');
    if (assignedToFilter) {
      query = query.in('assigned_to', assignedToFilter.split(','));
    }

    // Date range
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate) query = query.gte('created_at', startDate);
    if (endDate) query = query.lte('created_at', endDate);

    // Text search
    const searchQuery = searchParams.get('search');
    if (searchQuery) {
      query = query.or(
        `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,project_description.ilike.%${searchQuery}%`
      );
    }

    // Sorting
    const sortBy = searchParams.get('sortBy');
    const sortDirection = searchParams.get('sortDirection') || 'desc';
    // Map camelCase sort fields to snake_case
    const sortFieldMap: Record<string, string> = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      leadScore: 'lead_score',
      companySize: 'company_size',
      budgetRange: 'budget_range',
      projectType: 'project_type',
      followUpDate: 'follow_up_date',
    };
    const dbSortField = sortBy ? (sortFieldMap[sortBy] || sortBy) : 'created_at';
    query = query.order(dbSortField, { ascending: sortDirection === 'asc' });

    const { data, error } = await query;
    if (error) throw error;

    // Transform to camelCase for frontend
    const leads = (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      company: row.company,
      website: row.website,
      jobTitle: row.job_title,
      companySize: row.company_size,
      industry: row.industry,
      projectType: row.project_type,
      projectDescription: row.project_description,
      budgetRange: row.budget_range,
      timeline: row.timeline,
      primaryChallenge: row.primary_challenge,
      additionalChallenges: row.additional_challenges || [],
      specificRequirements: row.specific_requirements,
      status: row.status,
      priority: row.priority,
      source: row.source,
      leadScore: row.lead_score,
      assignedTo: row.assigned_to,
      nextAction: row.next_action,
      followUpDate: row.follow_up_date,
      notes: row.notes,
      tags: row.tags || [],
      customFields: row.custom_fields || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      convertedToClientAt: row.converted_to_client_at,
      clientId: row.client_id,
    }));

    return NextResponse.json({
      success: true,
      data: leads,
      total: leads.length,
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch leads' },
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

    const rawBody = await request.json();
    const validation = validateBody(createLeadSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = rawBody;

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
      additionalChallenges: body.additionalChallenges
        ?.filter((c: string) => c.trim())
        .map((c: string) => stripHtml(c)),
      specificRequirements: body.specificRequirements
        ? stripHtml(body.specificRequirements.trim())
        : undefined,
      source: body.source || 'website_form',
      customFields: body.customFields || {},
    };

    // Calculate lead score and priority
    const leadScore = calculateLeadScore({
      budgetRange: leadInput.budgetRange,
      timeline: leadInput.timeline,
      companySize: leadInput.companySize,
      industry: leadInput.industry,
      primaryChallenge: leadInput.primaryChallenge,
    });
    const priority = determineLeadPriority(leadScore);

    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    const leadId = `lead_${timestamp}_${random}`;

    const record = {
      id: leadId,
      name: leadInput.name,
      email: leadInput.email,
      phone: leadInput.phone || null,
      company: leadInput.company,
      website: leadInput.website || null,
      job_title: leadInput.jobTitle || null,
      company_size: leadInput.companySize,
      industry: leadInput.industry || null,
      project_type: leadInput.projectType,
      project_description: leadInput.projectDescription,
      budget_range: leadInput.budgetRange,
      timeline: leadInput.timeline,
      primary_challenge: leadInput.primaryChallenge,
      additional_challenges: leadInput.additionalChallenges || [],
      specific_requirements: leadInput.specificRequirements || null,
      status: 'new',
      priority,
      source: leadInput.source || 'website_form',
      lead_score: leadScore,
      tags: [],
      notes: '',
      custom_fields: leadInput.customFields || {},
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('leads').insert(record).select().single();

    if (error) throw error;

    // Fire-and-forget email notification
    const emailData = newLeadEmail({
      name: record.name,
      email: record.email,
      company: record.company,
      projectType: record.project_type,
      budgetRange: record.budget_range,
      timeline: record.timeline,
      primaryChallenge: record.primary_challenge,
      leadScore,
      priority,
    });
    notifyTeam(emailData.subject, emailData.html);

    // Build camelCase response
    const lead = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      website: data.website,
      jobTitle: data.job_title,
      companySize: data.company_size,
      industry: data.industry,
      projectType: data.project_type,
      projectDescription: data.project_description,
      budgetRange: data.budget_range,
      timeline: data.timeline,
      primaryChallenge: data.primary_challenge,
      additionalChallenges: data.additional_challenges,
      specificRequirements: data.specific_requirements,
      status: data.status,
      priority: data.priority,
      source: data.source,
      leadScore: data.lead_score,
      tags: data.tags,
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    return NextResponse.json(
      { success: true, data: lead, message: 'Lead created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

// DELETE /api/leads - Delete lead
export async function DELETE(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'Lead ID required' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('leads').delete().eq('id', id);
    if (error) {
      return NextResponse.json({ success: false, error: 'Failed to delete lead' }, { status: 500 });
    }

    // Fire-and-forget audit log (uses header-based user identity — requireAdminAuth has no user object)
    const auditUser = getAuditUser(request);
    logAuditEvent({
      ...auditUser,
      action: 'delete',
      resource_type: 'lead',
      resource_id: id,
      details: {},
      ip_address: getClientIP(request),
    });

    return NextResponse.json({ success: true, message: 'Lead deleted' });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}

// PUT /api/leads - Update lead
export async function PUT(request: NextRequest) {
  const auth = await requirePermission(request, 'clients.write');
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Lead ID is required' },
        { status: 400 }
      );
    }

    const { id, ...updateData } = body;

    // Map camelCase fields to snake_case for Supabase
    const updates: Record<string, any> = {};
    if (updateData.status !== undefined) updates.status = updateData.status;
    if (updateData.assignedTo !== undefined) updates.assigned_to = updateData.assignedTo;
    if (updateData.nextAction !== undefined) updates.next_action = updateData.nextAction;
    if (updateData.followUpDate !== undefined) updates.follow_up_date = updateData.followUpDate;
    if (updateData.notes !== undefined) updates.notes = updateData.notes;
    if (updateData.tags !== undefined) updates.tags = updateData.tags;
    if (updateData.priority !== undefined) updates.priority = updateData.priority;
    if (updateData.leadScore !== undefined) updates.lead_score = updateData.leadScore;
    if (updateData.customFields !== undefined) updates.custom_fields = updateData.customFields;
    if (updateData.convertedToClientAt !== undefined) updates.converted_to_client_at = updateData.convertedToClientAt;
    if (updateData.clientId !== undefined) updates.client_id = updateData.clientId;

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Transform response
    const updatedLead = {
      id: data.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      company: data.company,
      website: data.website,
      jobTitle: data.job_title,
      companySize: data.company_size,
      industry: data.industry,
      projectType: data.project_type,
      projectDescription: data.project_description,
      budgetRange: data.budget_range,
      timeline: data.timeline,
      primaryChallenge: data.primary_challenge,
      additionalChallenges: data.additional_challenges,
      specificRequirements: data.specific_requirements,
      status: data.status,
      priority: data.priority,
      source: data.source,
      leadScore: data.lead_score,
      assignedTo: data.assigned_to,
      nextAction: data.next_action,
      followUpDate: data.follow_up_date,
      notes: data.notes,
      tags: data.tags,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Fire-and-forget audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'update',
      resource_type: 'lead',
      resource_id: id,
      details: { updatedFields: Object.keys(updates), newStatus: updateData.status },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      data: updatedLead,
      message: 'Lead updated successfully',
    });
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}
