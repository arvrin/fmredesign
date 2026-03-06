/**
 * Talent Briefs API
 * GET — fetch project briefs assigned to this talent
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireTalentAuth } from '@/lib/talent-session';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const authError = await requireTalentAuth(request, slug);
  if (authError) return authError;

  try {
    const supabase = getSupabaseAdmin();

    // Get the talent profile
    const { data: profile } = await supabase
      .from('talent_profiles')
      .select('id')
      .eq('profile_slug', slug)
      .single();

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Get talent assignments directly (bypasses team_members entirely)
    const { data: assignments, error: assignError } = await supabase
      .from('talent_assignments')
      .select('*')
      .eq('talent_id', profile.id)
      .in('status', ['active', 'completed'])
      .order('created_at', { ascending: false });

    if (assignError) throw assignError;

    if (!assignments || assignments.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'No project assignments found.',
      });
    }

    // Get unique project and client IDs
    const projectIds = [...new Set(assignments.map(a => a.project_id).filter(Boolean))];
    const clientIds = [...new Set(assignments.map(a => a.client_id).filter(Boolean))];

    // Fetch projects with deliverables
    let projects: Record<string, unknown>[] = [];
    if (projectIds.length > 0) {
      const { data } = await supabase
        .from('projects')
        .select('id, name, status, progress, deliverables, milestones, client_id, created_at')
        .in('id', projectIds);
      projects = data || [];
    }

    // Fetch client names
    let clients: Record<string, unknown>[] = [];
    if (clientIds.length > 0) {
      const { data } = await supabase
        .from('clients')
        .select('id, name')
        .in('id', clientIds);
      clients = data || [];
    }

    const clientMap = Object.fromEntries((clients).map(c => [c.id, c.name]));

    // Build briefs
    const briefs = projects.map(p => {
      const assignment = assignments.find(a => a.project_id === p.id);
      return {
        projectId: p.id,
        projectName: p.name,
        clientName: clientMap[p.client_id as string] || 'Unknown',
        status: p.status,
        progress: p.progress || 0,
        deliverables: p.deliverables || [],
        milestones: p.milestones || [],
        role: assignment?.role || 'member',
        hoursAllocated: assignment?.hours_allocated || 0,
        createdAt: p.created_at,
      };
    });

    return NextResponse.json({
      success: true,
      data: briefs,
    });
  } catch (error) {
    console.error('Error fetching talent briefs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch briefs' },
      { status: 500 }
    );
  }
}
