/**
 * Lead Management API Routes
 * Handles CRUD operations for leads (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { calculateLeadScore, determineLeadPriority } from '@/lib/supabase-utils';
import type { LeadInput, LeadUpdate } from '@/lib/admin/lead-types';
import { rateLimit, getClientIp } from '@/lib/rate-limiter';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { createLeadSchema, validateBody } from '@/lib/validations/schemas';
import { notifyTeam, newLeadEmail } from '@/lib/email/send';
import { logAuditEvent, getAuditUser, getClientIP } from '@/lib/admin/audit-log';
import { notifyAdmins } from '@/lib/notifications';

// GET /api/leads - Fetch leads with optional filtering and sorting
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;

    // Pagination: only active when `page` param is provided (backwards compat)
    const pageParam = searchParams.get('page');
    const isPaginated = pageParam !== null;
    const page = Math.max(1, parseInt(pageParam || '1', 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '25', 10)));

    const supabase = getSupabaseAdmin();

    // Shared filter params
    const statusFilter = searchParams.get('status');
    const priorityFilter = searchParams.get('priority');
    const sourceFilter = searchParams.get('source');
    const projectTypeFilter = searchParams.get('projectType');
    const budgetRangeFilter = searchParams.get('budgetRange');
    const companySizeFilter = searchParams.get('companySize');
    const assignedToFilter = searchParams.get('assignedTo');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const searchQuery = searchParams.get('search');

    // Sorting
    const sortBy = searchParams.get('sortBy');
    const sortDirection = searchParams.get('sortDirection') || 'desc';
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

    /** Apply shared filters to a query builder */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function applyFilters(q: any) {
      if (statusFilter) q = q.in('status', statusFilter.split(','));
      if (priorityFilter) q = q.in('priority', priorityFilter.split(','));
      if (sourceFilter) q = q.in('source', sourceFilter.split(','));
      if (projectTypeFilter) q = q.in('project_type', projectTypeFilter.split(','));
      if (budgetRangeFilter) q = q.in('budget_range', budgetRangeFilter.split(','));
      if (companySizeFilter) q = q.in('company_size', companySizeFilter.split(','));
      if (assignedToFilter) q = q.in('assigned_to', assignedToFilter.split(','));
      if (startDate) q = q.gte('created_at', startDate);
      if (endDate) q = q.lte('created_at', endDate);
      if (searchQuery) {
        q = q.or(
          `name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%,company.ilike.%${searchQuery}%,project_description.ilike.%${searchQuery}%`
        );
      }
      return q;
    }

    let data;
    let totalItems = 0;

    if (isPaginated) {
      // Get total count with same filters
      const { count, error: countError } = await applyFilters(
        supabase.from('leads').select('*', { count: 'exact', head: true })
      );
      if (countError) throw countError;
      totalItems = count || 0;

      // Paginated data
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      let query = applyFilters(supabase.from('leads').select('*'));
      query = query.order(dbSortField, { ascending: sortDirection === 'asc' });
      query = query.range(from, to);
      const result = await query;
      if (result.error) throw result.error;
      data = result.data;
    } else {
      let query = applyFilters(supabase.from('leads').select('*'));
      query = query.order(dbSortField, { ascending: sortDirection === 'asc' });
      const result = await query;
      if (result.error) throw result.error;
      data = result.data;
    }

    // Transform to camelCase for frontend
    const leads = (data || []).map((row: Record<string, any>) => ({
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

    const responseBody: Record<string, unknown> = {
      success: true,
      data: leads,
      total: isPaginated ? totalItems : leads.length,
    };

    if (isPaginated) {
      responseBody.pagination = {
        page,
        pageSize,
        totalItems,
        totalPages: Math.ceil(totalItems / pageSize),
      };
    }

    return NextResponse.json(responseBody);
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

    // Fire-and-forget: notify admins about new lead
    notifyAdmins({
      type: 'general',
      title: 'New lead received',
      message: `${record.name} — ${record.company || 'No company'}`,
      priority: 'high',
      actionUrl: '/admin/leads',
    });

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
    await logAuditEvent({
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
    await logAuditEvent({
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
