/**
 * Public Share Link Resolver API
 * Resolves a share token to the associated resource data
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Token is required' }, { status: 400 });
    }

    // Look up the share link
    const { data: link, error: linkError } = await supabaseAdmin
      .from('share_links')
      .select('*')
      .eq('token', token)
      .single();

    if (linkError || !link) {
      return NextResponse.json({ success: false, error: 'Share link not found' }, { status: 404 });
    }

    // Check expiry
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return NextResponse.json({ success: false, error: 'This share link has expired' }, { status: 410 });
    }

    // Get client name for branding
    const { data: client } = await supabaseAdmin
      .from('clients')
      .select('name, logo')
      .eq('id', link.client_id)
      .single();

    let resource: Record<string, unknown> | null = null;

    if (link.resource_type === 'project') {
      const { data: project } = await supabaseAdmin
        .from('projects')
        .select('*')
        .eq('id', link.resource_id)
        .single();

      if (project) {
        resource = {
          type: 'project',
          name: project.name,
          description: project.description || '',
          status: project.status,
          progress: project.progress || 0,
          startDate: project.start_date,
          endDate: project.end_date,
          milestones: project.milestones || [],
          deliverables: project.deliverables || [],
        };
      }
    } else if (link.resource_type === 'report') {
      // For reports, we fetch summary data from projects + content
      const [{ data: projects }, { data: content }] = await Promise.all([
        supabaseAdmin
          .from('projects')
          .select('name, status, progress, budget, spent')
          .eq('client_id', link.client_id),
        supabaseAdmin
          .from('content_calendar')
          .select('title, status, platform, scheduled_date')
          .eq('client_id', link.client_id)
          .order('scheduled_date', { ascending: false })
          .limit(10),
      ]);

      resource = {
        type: 'report',
        projects: (projects || []).map(p => ({
          name: p.name,
          status: p.status,
          progress: p.progress || 0,
        })),
        recentContent: (content || []).map(c => ({
          title: c.title,
          status: c.status,
          platform: c.platform,
          scheduledDate: c.scheduled_date,
        })),
      };
    }

    if (!resource) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        label: link.label || '',
        clientName: client?.name || '',
        clientLogo: client?.logo || '',
        resource,
      },
    });
  } catch (error) {
    console.error('Error resolving share link:', error);
    return NextResponse.json({ success: false, error: 'Failed to resolve share link' }, { status: 500 });
  }
}
