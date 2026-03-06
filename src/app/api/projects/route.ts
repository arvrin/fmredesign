/**
 * Projects API Routes
 * Handles CRUD operations for project management (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { ProjectUtils } from '@/lib/admin/project-types';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { createProjectSchema, updateProjectSchema, validateBody } from '@/lib/validations/schemas';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';
import { notifyClient, notifyTalent } from '@/lib/notifications';

// GET /api/projects
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;

    // Single resource fetch by ID
    const id = searchParams.get('id');
    if (id) {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();
      if (error || !data) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      }

      // Fetch rich talent assignment details
      let assignedTalentDetails: { id: string; assignmentId: string; name: string; category: string; role: string; hoursAllocated: number }[] = [];
      try {
        const { data: assignments } = await supabase
          .from('talent_assignments')
          .select('id, talent_id, role, hours_allocated')
          .eq('project_id', id)
          .eq('status', 'active');

        if (assignments && assignments.length > 0) {
          const talentIds = assignments.map((a: any) => a.talent_id);
          const { data: profiles } = await supabase
            .from('talent_profiles')
            .select('id, personal_info, professional_details')
            .in('id', talentIds);

          const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));
          assignedTalentDetails = assignments.map((a: any) => {
            const profile = profileMap.get(a.talent_id) as any;
            const personalInfo = profile?.personal_info || {};
            const professionalDetails = profile?.professional_details || {};
            return {
              id: a.talent_id,
              assignmentId: a.id,
              name: personalInfo.fullName || 'Unknown',
              category: professionalDetails.primaryCategory || 'other',
              role: a.role || 'Freelancer',
              hoursAllocated: a.hours_allocated || 0,
            };
          });
        }
      } catch {
        // Non-fatal — talent_assignments table may not exist yet
      }

      const project = {
        id: data.id,
        clientId: data.client_id,
        discoveryId: data.discovery_id,
        name: data.name,
        description: data.description,
        type: data.type,
        status: data.status,
        priority: data.priority,
        startDate: data.start_date,
        endDate: data.end_date,
        estimatedHours: data.estimated_hours,
        projectManager: data.project_manager,
        assignedTalent: data.assigned_talent || [],
        assignedTalentDetails,
        budget: data.budget,
        spent: data.spent,
        hourlyRate: data.hourly_rate,
        progress: data.progress,
        milestones: data.milestones || [],
        deliverables: data.deliverables || [],
        contentRequirements: data.content_requirements || {},
        tags: data.tags || [],
        invoiceIds: data.invoice_ids || [],
        notes: data.notes,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      };
      return NextResponse.json({ success: true, data: project });
    }

    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    // Pagination: only active when `page` param is provided (backwards compat)
    const pageParam = searchParams.get('page');
    const isPaginated = pageParam !== null;
    const page = Math.max(1, parseInt(pageParam || '1', 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(searchParams.get('pageSize') || '25', 10)));

    const supabase = getSupabaseAdmin();

    // Map camelCase sort fields to snake_case
    const sortFieldMap: Record<string, string> = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      startDate: 'start_date',
      endDate: 'end_date',
    };
    const dbSortField = sortFieldMap[sortBy] || sortBy;

    let data;
    let totalItems = 0;

    if (isPaginated) {
      // Get total count with same filters
      let countQuery = supabase.from('projects').select('*', { count: 'exact', head: true });
      if (clientId) countQuery = countQuery.eq('client_id', clientId);
      if (status) countQuery = countQuery.in('status', status.split(','));
      if (type) countQuery = countQuery.in('type', type.split(','));
      const { count, error: countError } = await countQuery;
      if (countError) throw countError;
      totalItems = count || 0;

      // Paginated data
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      let query = supabase.from('projects').select('*');
      if (clientId) query = query.eq('client_id', clientId);
      if (status) query = query.in('status', status.split(','));
      if (type) query = query.in('type', type.split(','));
      query = query.order(dbSortField, { ascending: sortDirection === 'asc' });
      query = query.range(from, to);
      const result = await query;
      if (result.error) throw result.error;
      data = result.data;
    } else {
      let query = supabase.from('projects').select('*');
      if (clientId) query = query.eq('client_id', clientId);
      if (status) query = query.in('status', status.split(','));
      if (type) query = query.in('type', type.split(','));
      query = query.order(dbSortField, { ascending: sortDirection === 'asc' });
      const result = await query;
      if (result.error) throw result.error;
      data = result.data;
    }

    // Transform to camelCase for frontend
    const projects = (data || []).map((p) => ({
      id: p.id,
      clientId: p.client_id,
      discoveryId: p.discovery_id,
      name: p.name,
      description: p.description,
      type: p.type,
      status: p.status,
      priority: p.priority,
      startDate: p.start_date,
      endDate: p.end_date,
      estimatedHours: p.estimated_hours,
      projectManager: p.project_manager,
      assignedTalent: p.assigned_talent || [],
      budget: p.budget,
      spent: p.spent,
      hourlyRate: p.hourly_rate,
      progress: p.progress,
      milestones: p.milestones || [],
      deliverables: p.deliverables || [],
      contentRequirements: p.content_requirements || {},
      tags: p.tags || [],
      invoiceIds: p.invoice_ids || [],
      notes: p.notes,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    const responseBody: Record<string, unknown> = {
      success: true,
      data: projects,
      total: isPaginated ? totalItems : projects.length,
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
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects
export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'projects.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(createProjectSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = validation.data;

    const newProject = {
      id: ProjectUtils.generateProjectId(),
      client_id: body.clientId,
      discovery_id: body.discoveryId || null,
      name: body.name.trim(),
      description: body.description?.trim() || '',
      type: body.type,
      status: 'planning',
      priority: body.priority || 'medium',
      start_date: body.startDate,
      end_date: body.endDate,
      estimated_hours: body.estimatedHours || 0,
      project_manager: body.projectManager,
      budget: parseFloat(String(body.budget)),
      hourly_rate: parseFloat(String(body.hourlyRate ?? '0')) || 0,
      progress: 0,
      milestones: [],
      deliverables: [],
      content_requirements: body.contentRequirements || { postsPerWeek: 0, platforms: [], contentTypes: [] },
      assigned_talent: (rawBody as any).assignedTalent || [],
      tags: body.tags || [],
      notes: body.notes?.trim() || '',
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('projects').insert(newProject).select().single();

    if (error) throw error;

    // Sync talent_assignments for assigned talent (non-fatal)
    const assignedTalentIds: string[] = (rawBody as any).assignedTalent || [];
    if (assignedTalentIds.length > 0 && data.client_id) {
      try {
        const assignmentRows = assignedTalentIds.map((talentId: string) => ({
          talent_id: talentId,
          client_id: data.client_id,
          project_id: data.id,
          role: 'Freelancer',
          status: 'active',
          start_date: data.start_date || new Date().toISOString().split('T')[0],
        }));
        await supabase.from('talent_assignments').insert(assignmentRows);

        // Resolve slugs for notification URLs
        const { data: talentProfiles } = await supabase
          .from('talent_profiles')
          .select('id, profile_slug')
          .in('id', assignedTalentIds);
        const slugMap = new Map((talentProfiles || []).map((p: { id: string; profile_slug: string }) => [p.id, p.profile_slug]));

        // Notify each assigned talent about the new brief
        for (const talentId of assignedTalentIds) {
          const talentSlug = slugMap.get(talentId) || talentId;
          notifyTalent(talentId, {
            type: 'brief_assigned',
            title: 'New project brief',
            message: `You've been assigned to ${data.name}`,
            actionUrl: `/creativeminds/portal/${talentSlug}/briefs`,
          });
        }
      } catch (assignErr) {
        console.error('Non-fatal: failed to create talent_assignments:', assignErr);
      }
    }

    // Response in camelCase
    const responseProject = {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      description: data.description,
      type: data.type,
      status: data.status,
      priority: data.priority,
      startDate: data.start_date,
      endDate: data.end_date,
      estimatedHours: data.estimated_hours,
      projectManager: data.project_manager,
      assignedTalent: assignedTalentIds,
      budget: data.budget,
      hourlyRate: data.hourly_rate,
      progress: 0,
      milestones: [],
      deliverables: [],
      contentRequirements: data.content_requirements,
      tags: data.tags,
      invoiceIds: [],
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Fire-and-forget audit log
    await logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'create',
      resource_type: 'project',
      resource_id: data.id,
      details: { name: data.name, clientId: data.client_id },
      ip_address: getClientIP(request),
    });

    // Notify client about new project
    if (data.client_id) {
      notifyClient(data.client_id, {
        type: 'project_created',
        title: 'New project created',
        message: data.name,
        actionUrl: `/client/${data.client_id}/projects`,
      });
    }

    return NextResponse.json(
      { success: true, data: responseProject, message: 'Project created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects
export async function PUT(request: NextRequest) {
  const auth = await requirePermission(request, 'projects.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(updateProjectSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = rawBody;

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const updates: Record<string, any> = {};
    if (body.name !== undefined) updates.name = body.name;
    if (body.description !== undefined) updates.description = body.description;
    if (body.status !== undefined) updates.status = body.status;
    if (body.priority !== undefined) updates.priority = body.priority;
    if (body.endDate !== undefined) updates.end_date = body.endDate;
    if (body.progress !== undefined) updates.progress = body.progress;
    if (body.assignedTalent !== undefined) updates.assigned_talent = body.assignedTalent;
    if (body.notes !== undefined) updates.notes = body.notes;
    if (body.milestones !== undefined) updates.milestones = body.milestones;
    if (body.deliverables !== undefined) updates.deliverables = body.deliverables;
    if (body.contentRequirements !== undefined) updates.content_requirements = body.contentRequirements;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.invoiceIds !== undefined) updates.invoice_ids = body.invoiceIds;
    if (body.clientSatisfaction !== undefined) updates.client_satisfaction = body.clientSatisfaction;

    const supabase = getSupabaseAdmin();

    // Fetch old state to detect milestone/deliverable changes
    let oldMilestones: any[] = [];
    let oldDeliverables: any[] = [];
    if (body.milestones || body.deliverables) {
      const { data: oldProject } = await supabase
        .from('projects')
        .select('milestones, deliverables')
        .eq('id', body.id)
        .single();
      if (oldProject) {
        oldMilestones = oldProject.milestones || [];
        oldDeliverables = oldProject.deliverables || [];
      }
    }

    const { data, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Sync talent_assignments when assignedTalent changes (non-fatal)
    if (body.assignedTalent !== undefined && data.client_id) {
      try {
        // Remove existing active assignments for this project
        await supabase
          .from('talent_assignments')
          .delete()
          .eq('project_id', body.id)
          .eq('status', 'active');

        // Insert new assignments
        const talentIds: string[] = body.assignedTalent || [];
        if (talentIds.length > 0) {
          const assignmentRows = talentIds.map((talentId: string) => ({
            talent_id: talentId,
            client_id: data.client_id,
            project_id: data.id,
            role: 'Freelancer',
            status: 'active',
            start_date: data.start_date || new Date().toISOString().split('T')[0],
          }));
          await supabase.from('talent_assignments').insert(assignmentRows);
        }
      } catch (assignErr) {
        console.error('Non-fatal: failed to sync talent_assignments:', assignErr);
      }
    }

    const responseProject = {
      id: data.id,
      clientId: data.client_id,
      name: data.name,
      description: data.description,
      type: data.type,
      status: data.status,
      priority: data.priority,
      startDate: data.start_date,
      endDate: data.end_date,
      estimatedHours: data.estimated_hours,
      projectManager: data.project_manager,
      assignedTalent: data.assigned_talent || [],
      budget: data.budget,
      hourlyRate: data.hourly_rate,
      progress: data.progress,
      milestones: data.milestones || [],
      deliverables: data.deliverables || [],
      contentRequirements: data.content_requirements || {},
      tags: data.tags || [],
      invoiceIds: data.invoice_ids || [],
      notes: data.notes,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Fire-and-forget audit log
    await logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'update',
      resource_type: 'project',
      resource_id: data.id,
      details: { name: data.name, updatedFields: Object.keys(updates) },
      ip_address: getClientIP(request),
    });

    // Notify client on status changes
    if (body.status && data.client_id) {
      const statusLabels: Record<string, string> = {
        active: 'is now active',
        completed: 'has been completed',
        on_hold: 'is on hold',
        cancelled: 'has been cancelled',
      };
      const label = statusLabels[body.status];
      if (label) {
        notifyClient(data.client_id, {
          type: 'project_status_changed',
          title: `Project ${label}`,
          message: data.name,
          actionUrl: `/client/${data.client_id}/projects`,
        });
      }
    }

    // Notify client on milestone/deliverable completions
    if (data.client_id) {
      if (body.milestones && Array.isArray(body.milestones)) {
        const oldCompletedIds = new Set(
          oldMilestones.filter((m: any) => m.status === 'completed').map((m: any) => m.id || m.name)
        );
        const newlyCompleted = body.milestones.filter(
          (m: any) => m.status === 'completed' && !oldCompletedIds.has(m.id || m.name)
        );
        for (const milestone of newlyCompleted) {
          notifyClient(data.client_id, {
            type: 'project_status_changed',
            title: 'Project milestone completed',
            message: `${data.name} — ${milestone.name || 'Milestone'}`,
            actionUrl: `/client/${data.client_id}/projects`,
          });
        }
      }

      if (body.deliverables && Array.isArray(body.deliverables)) {
        const oldDeliveredIds = new Set(
          oldDeliverables.filter((d: any) => d.status === 'delivered').map((d: any) => d.id || d.name)
        );
        const newlyDelivered = body.deliverables.filter(
          (d: any) => d.status === 'delivered' && !oldDeliveredIds.has(d.id || d.name)
        );
        for (const deliverable of newlyDelivered) {
          notifyClient(data.client_id, {
            type: 'project_status_changed',
            title: 'Deliverable ready',
            message: `${data.name} — ${deliverable.name || 'Deliverable'}`,
            actionUrl: `/client/${data.client_id}/projects`,
          });
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: responseProject,
      message: 'Project updated successfully',
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects
export async function DELETE(request: NextRequest) {
  const auth = await requirePermission(request, 'projects.delete');
  if ('error' in auth) return auth.error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('id');

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('projects').delete().eq('id', projectId);

    if (error) throw error;

    // Fire-and-forget audit log
    await logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'delete',
      resource_type: 'project',
      resource_id: projectId,
      details: {},
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}
