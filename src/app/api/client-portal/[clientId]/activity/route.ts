/**
 * Client Portal Activity Feed API
 * Derives recent activity from existing tables
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { resolveClientId } from '@/lib/client-portal/resolve-client';

interface ActivityItem {
  type: string;
  title: string;
  description: string;
  timestamp: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const resolved = await resolveClientId(clientId);
    if (!resolved) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    const activities: ActivityItem[] = [];

    // Fetch recent projects
    const { data: projects } = await supabaseAdmin
      .from('projects')
      .select('id, name, status, created_at, updated_at')
      .eq('client_id', resolved.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    if (projects) {
      for (const p of projects) {
        if (p.created_at === p.updated_at) {
          activities.push({
            type: 'project_created',
            title: 'New project created',
            description: p.name,
            timestamp: p.created_at,
          });
        } else {
          activities.push({
            type: 'project_updated',
            title: 'Project updated',
            description: `${p.name} — ${p.status}`,
            timestamp: p.updated_at,
          });
        }
      }
    }

    // Fetch recent content
    const { data: content } = await supabaseAdmin
      .from('content_calendar')
      .select('id, title, status, created_at, approved_at, published_date')
      .eq('client_id', resolved.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (content) {
      for (const c of content) {
        if (c.approved_at) {
          activities.push({
            type: 'content_approved',
            title: 'Content approved',
            description: c.title || 'Untitled',
            timestamp: c.approved_at,
          });
        }
        if (c.published_date) {
          activities.push({
            type: 'content_published',
            title: 'Content published',
            description: c.title || 'Untitled',
            timestamp: c.published_date,
          });
        }
        activities.push({
          type: 'content_created',
          title: 'Content created',
          description: c.title || 'Untitled',
          timestamp: c.created_at,
        });
      }
    }

    // Fetch recent support tickets
    const { data: tickets } = await supabaseAdmin
      .from('support_tickets')
      .select('id, subject, status, created_at, updated_at')
      .eq('client_id', resolved.id)
      .order('updated_at', { ascending: false })
      .limit(5);

    if (tickets) {
      for (const t of tickets) {
        if (t.created_at === t.updated_at) {
          activities.push({
            type: 'ticket_created',
            title: 'Support ticket created',
            description: t.subject || 'Support request',
            timestamp: t.created_at,
          });
        } else {
          activities.push({
            type: 'ticket_updated',
            title: 'Ticket updated',
            description: `${t.subject || 'Support request'} — ${t.status}`,
            timestamp: t.updated_at,
          });
        }
      }
    }

    // Fetch recent documents
    const { data: documents } = await supabaseAdmin
      .from('client_documents')
      .select('id, name, created_at')
      .eq('client_id', resolved.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (documents) {
      for (const d of documents) {
        activities.push({
          type: 'document_shared',
          title: 'Document shared',
          description: d.name,
          timestamp: d.created_at,
        });
      }
    }

    // Sort by timestamp DESC and limit to 10
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const limited = activities.slice(0, 10);

    return NextResponse.json({
      success: true,
      data: limited,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch activity' }, { status: 500 });
  }
}
