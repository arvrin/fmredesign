/**
 * Projects API Routes
 * Handles CRUD operations for project management (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import type { ProjectInput, Project } from '@/lib/admin/project-types';
import { ProjectUtils } from '@/lib/admin/project-types';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';

// GET /api/projects
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const sortBy = searchParams.get('sortBy') || 'created_at';
    const sortDirection = searchParams.get('sortDirection') || 'desc';

    const supabase = getSupabaseAdmin();
    let query = supabase.from('projects').select('*');

    if (clientId) query = query.eq('client_id', clientId);
    if (status) query = query.in('status', status.split(','));
    if (type) query = query.in('type', type.split(','));

    // Map camelCase sort fields to snake_case
    const sortFieldMap: Record<string, string> = {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      startDate: 'start_date',
      endDate: 'end_date',
    };
    const dbSortField = sortFieldMap[sortBy] || sortBy;
    query = query.order(dbSortField, { ascending: sortDirection === 'asc' });

    const { data, error } = await query;
    if (error) throw error;

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

    return NextResponse.json({
      success: true,
      data: projects,
      total: projects.length,
    });
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
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const requiredFields = ['clientId', 'name', 'type', 'startDate', 'endDate', 'projectManager', 'budget'];
    const missingFields = requiredFields.filter((field) => !body[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields', missingFields },
        { status: 400 }
      );
    }

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
      budget: parseFloat(body.budget),
      hourly_rate: parseFloat(body.hourlyRate) || 0,
      progress: 0,
      milestones: [],
      deliverables: [],
      content_requirements: body.contentRequirements || { postsPerWeek: 0, platforms: [], contentTypes: [] },
      tags: body.tags || [],
      notes: body.notes?.trim() || '',
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('projects').insert(newProject).select().single();

    if (error) throw error;

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
      assignedTalent: [],
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
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();

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
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

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
