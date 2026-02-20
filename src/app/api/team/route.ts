/**
 * Team Management API Route
 * Handles CRUD operations for team members (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { createTeamMemberSchema, updateTeamMemberSchema, validateBody } from '@/lib/validations/schemas';

/** Transform a Supabase row (snake_case) to camelCase for the frontend */
function transformMember(row: any) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    avatar: row.avatar_url,
    type: row.type,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    role: row.role,
    department: row.department,
    seniority: row.seniority,
    skills: row.skills || [],
    certifications: row.certifications || [],
    compensation: row.compensation || {},
    workType: row.work_type,
    location: row.location,
    capacity: row.capacity_hours,
    assignedClients: row.assigned_client_ids || [],
    currentProjects: row.current_project_ids || [],
    workload: row.workload || 0,
    clientRatings: parseFloat(row.client_ratings) || 0,
    tasksCompleted: row.tasks_completed || 0,
    efficiency: row.efficiency || 0,
    documents: row.documents || [],
    notes: row.notes || '',
    emergencyContact: row.emergency_contact,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/team - Fetch all team members, or a single member via ?id=
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');

    // Single member fetch
    if (memberId) {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('id', memberId)
        .single();

      if (error || !data) {
        return NextResponse.json(
          { success: false, error: 'Team member not found' },
          { status: 404 }
        );
      }

      const response = NextResponse.json({
        success: true,
        data: transformMember(data),
      });
      response.headers.set('Cache-Control', 'no-store');
      return response;
    }

    // All members fetch
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    const members = (data || []).map(transformMember);

    // Calculate metrics
    const activeMembers = members.filter(m => m.status === 'active');
    const totalCapacity = activeMembers.reduce((sum, m) => sum + m.capacity, 0);
    const totalWorkload = activeMembers.reduce((sum, m) => sum + (m.workload * m.capacity / 100), 0);

    const metrics = {
      totalMembers: members.length,
      activeMembers: activeMembers.length,
      employees: members.filter(m => m.type === 'employee').length,
      freelancers: members.filter(m => m.type === 'freelancer').length,
      avgUtilization: totalCapacity > 0 ? Math.round((totalWorkload / totalCapacity) * 100) : 0,
      totalCapacity,
    };

    const response = NextResponse.json({
      success: true,
      data: members,
      metrics,
    });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}

// POST /api/team - Create or update a team member
export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'users.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(createTeamMemberSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = rawBody;
    const supabase = getSupabaseAdmin();

    const id = body.id || `tm-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const record = {
      id,
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      avatar_url: body.avatar || null,
      type: body.type || 'employee',
      status: body.status || 'active',
      start_date: body.startDate || new Date().toISOString().split('T')[0],
      end_date: body.endDate || null,
      role: body.role,
      department: body.department,
      seniority: body.seniority || 'mid',
      skills: body.skills || [],
      certifications: body.certifications || [],
      compensation: body.compensation || {},
      work_type: body.workType || 'full-time',
      location: body.location || 'office',
      capacity_hours: body.capacity || 40,
      assigned_client_ids: body.assignedClients || [],
      current_project_ids: body.currentProjects || [],
      workload: body.workload || 0,
      client_ratings: body.clientRatings || 0,
      tasks_completed: body.tasksCompleted || 0,
      efficiency: body.efficiency || 0,
      documents: body.documents || [],
      notes: body.notes || '',
      emergency_contact: body.emergencyContact || null,
    };

    const { error } = await supabase.from('team_members').upsert(record);
    if (error) throw error;

    return NextResponse.json({
      success: true,
      data: { ...body, id },
      message: 'Team member saved successfully',
    });
  } catch (error) {
    console.error('Error saving team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save team member' },
      { status: 500 }
    );
  }
}

// PUT /api/team - Update a team member
export async function PUT(request: NextRequest) {
  const auth = await requirePermission(request, 'users.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(updateTeamMemberSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const { id, ...body } = rawBody;

    const supabase = getSupabaseAdmin();
    const updates: Record<string, any> = { updated_at: new Date().toISOString() };

    if (body.name) updates.name = body.name;
    if (body.email) updates.email = body.email;
    if (body.phone !== undefined) updates.phone = body.phone || null;
    if (body.avatar !== undefined) updates.avatar_url = body.avatar || null;
    if (body.type) updates.type = body.type;
    if (body.status) updates.status = body.status;
    if (body.startDate) updates.start_date = body.startDate;
    if (body.endDate !== undefined) updates.end_date = body.endDate || null;
    if (body.role) updates.role = body.role;
    if (body.department) updates.department = body.department;
    if (body.seniority) updates.seniority = body.seniority;
    if (body.skills) updates.skills = body.skills;
    if (body.certifications) updates.certifications = body.certifications;
    if (body.compensation) updates.compensation = body.compensation;
    if (body.workType) updates.work_type = body.workType;
    if (body.location) updates.location = body.location;
    if (body.capacity !== undefined) updates.capacity_hours = body.capacity;
    if (body.workload !== undefined) updates.workload = body.workload;
    if (body.notes !== undefined) updates.notes = body.notes;

    const { error } = await supabase
      .from('team_members')
      .update(updates)
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Team member updated successfully',
    });
  } catch (error) {
    console.error('Error updating team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// DELETE /api/team - Delete a team member
export async function DELETE(request: NextRequest) {
  const auth = await requirePermission(request, 'users.delete');
  if ('error' in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Team member ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('team_members').delete().eq('id', id);

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: 'Team member deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting team member:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete team member' },
      { status: 500 }
    );
  }
}
