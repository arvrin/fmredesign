/**
 * Team Assignments API Route
 * Handles CRUD operations for team member assignments (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';

/** Transform a Supabase row (snake_case) to camelCase */
function transformAssignment(row: any) {
  return {
    id: row.id,
    teamMemberId: row.team_member_id,
    clientId: row.client_id,
    projectId: row.project_id,
    role: row.role,
    startDate: row.start_date,
    endDate: row.end_date,
    hoursAllocated: row.hours_allocated,
    isLead: row.is_lead,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// GET /api/team/assignments - List assignments
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const { searchParams } = new URL(request.url);
    const teamMemberId = searchParams.get('teamMemberId');
    const clientId = searchParams.get('clientId');

    const supabase = getSupabaseAdmin();
    let query = supabase.from('team_assignments').select('*');

    if (teamMemberId) query = query.eq('team_member_id', teamMemberId);
    if (clientId) query = query.eq('client_id', clientId);

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;

    const assignments = (data || []).map(transformAssignment);

    const response = NextResponse.json({ success: true, data: assignments });
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    console.error('Error fetching assignments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch assignments' },
      { status: 500 }
    );
  }
}

// POST /api/team/assignments - Create assignment
export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'projects.write');
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();

    if (!body.teamMemberId || !body.clientId) {
      return NextResponse.json(
        { success: false, error: 'teamMemberId and clientId are required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const id = `assignment-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { error } = await supabase.from('team_assignments').insert({
      id,
      team_member_id: body.teamMemberId,
      client_id: body.clientId,
      project_id: body.projectId || null,
      role: body.role || 'Team Member',
      start_date: body.startDate || new Date().toISOString().split('T')[0],
      end_date: body.endDate || null,
      hours_allocated: body.hoursAllocated || 10,
      is_lead: body.isLead || false,
      status: body.status || 'active',
    });

    if (error) throw error;

    // Fire-and-forget audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'create',
      resource_type: 'team_assignment',
      resource_id: id,
      details: { teamMemberId: body.teamMemberId, clientId: body.clientId },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      data: { id },
      message: 'Assignment created successfully',
    });
  } catch (error) {
    console.error('Error creating assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create assignment' },
      { status: 500 }
    );
  }
}

// DELETE /api/team/assignments - Delete assignment
export async function DELETE(request: NextRequest) {
  const auth = await requirePermission(request, 'projects.delete');
  if ('error' in auth) return auth.error;

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Assignment ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('team_assignments').delete().eq('id', id);
    if (error) throw error;

    // Fire-and-forget audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'delete',
      resource_type: 'team_assignment',
      resource_id: id,
      details: {},
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      message: 'Assignment deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting assignment:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete assignment' },
      { status: 500 }
    );
  }
}
