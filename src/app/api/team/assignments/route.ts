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

    // Sync is_lead → clients.account_manager
    if (body.isLead) {
      try {
        const { data: memberData } = await supabase
          .from('team_members')
          .select('name')
          .eq('id', body.teamMemberId)
          .single();

        if (memberData?.name) {
          await supabase
            .from('clients')
            .update({ account_manager: memberData.name })
            .eq('id', body.clientId);
        }
      } catch (syncErr) {
        console.error('Error syncing is_lead to account_manager:', syncErr);
      }
    }

    // Fire-and-forget audit log
    await logAuditEvent({
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

    // Fetch the assignment before deleting to check if it was a lead
    const { data: assignment } = await supabase
      .from('team_assignments')
      .select('is_lead, client_id')
      .eq('id', id)
      .single();

    const { error } = await supabase.from('team_assignments').delete().eq('id', id);
    if (error) throw error;

    // If deleted assignment was is_lead, find next lead or reset to 'admin'
    if (assignment?.is_lead && assignment?.client_id) {
      try {
        const { data: nextLead } = await supabase
          .from('team_assignments')
          .select('team_member_id')
          .eq('client_id', assignment.client_id)
          .eq('is_lead', true)
          .limit(1)
          .single();

        if (nextLead?.team_member_id) {
          const { data: memberData } = await supabase
            .from('team_members')
            .select('name')
            .eq('id', nextLead.team_member_id)
            .single();

          await supabase
            .from('clients')
            .update({ account_manager: memberData?.name || 'admin' })
            .eq('id', assignment.client_id);
        } else {
          await supabase
            .from('clients')
            .update({ account_manager: 'admin' })
            .eq('id', assignment.client_id);
        }
      } catch (syncErr) {
        console.error('Error syncing is_lead removal to account_manager:', syncErr);
      }
    }

    // Fire-and-forget audit log
    await logAuditEvent({
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
