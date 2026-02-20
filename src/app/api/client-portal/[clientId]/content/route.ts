/**
 * Client Portal Content API
 * Provides client-specific content calendar information from Supabase
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireClientAuth } from '@/lib/client-session';
import { notifyAdmins } from '@/lib/notifications';
import { notifyTeam, contentActionEmail } from '@/lib/email/send';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    const { searchParams } = request.nextUrl;
    const status = searchParams.get('status');
    const platform = searchParams.get('platform');
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'Client ID is required' },
        { status: 400 }
      );
    }

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    let query = supabaseAdmin
      .from('content_calendar')
      .select('*')
      .eq('client_id', clientId)
      .order('scheduled_date', { ascending: false });

    if (status) {
      const statusList = status.split(',');
      query = query.in('status', statusList);
    }

    if (platform) {
      const platformList = platform.split(',');
      query = query.in('platform', platformList);
    }

    if (type) {
      const typeList = type.split(',');
      query = query.in('type', typeList);
    }

    if (startDate) {
      query = query.gte('scheduled_date', startDate);
    }

    if (endDate) {
      query = query.lte('scheduled_date', endDate);
    }

    if (limit > 0) {
      query = query.limit(limit);
    }

    const { data: content, error } = await query;

    if (error) {
      console.error('Supabase content query error:', error);
      return NextResponse.json({
        success: true,
        data: [],
        total: 0
      });
    }

    const transformedContent = (content || []).map(transformContentForClient);

    return NextResponse.json({
      success: true,
      data: transformedContent,
      total: transformedContent.length
    });

  } catch (error) {
    console.error('Error fetching client content:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch content',
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  try {
    const { clientId } = await params;
    if (!clientId) {
      return NextResponse.json({ success: false, error: 'Client ID is required' }, { status: 400 });
    }

    const authError = await requireClientAuth(request, clientId);
    if (authError) return authError;

    const body = await request.json();
    const { contentId, action, feedback } = body;

    if (!contentId || !action) {
      return NextResponse.json({ success: false, error: 'contentId and action are required' }, { status: 400 });
    }

    if (!['approve', 'request_revision'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    // Verify the content belongs to this client and is in review status
    const { data: content, error: fetchError } = await supabaseAdmin
      .from('content_calendar')
      .select('id, status, client_id')
      .eq('id', contentId)
      .eq('client_id', clientId)
      .single();

    if (fetchError || !content) {
      return NextResponse.json({ success: false, error: 'Content not found' }, { status: 404 });
    }

    if (content.status !== 'review') {
      return NextResponse.json({ success: false, error: 'Content is not pending review' }, { status: 400 });
    }

    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };

    if (action === 'approve') {
      updates.status = 'approved';
      updates.approved_at = new Date().toISOString();
      if (feedback) updates.client_feedback = feedback;
    } else {
      updates.status = 'revision_needed';
      if (feedback) updates.revision_notes = feedback;
    }

    const { error: updateError } = await supabaseAdmin
      .from('content_calendar')
      .update(updates)
      .eq('id', contentId);

    if (updateError) {
      console.error('Supabase content update error:', updateError);
      return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 });
    }

    // Notify admin team about client's content decision
    notifyAdmins({
      type: action === 'approve' ? 'content_approved' : 'content_revision_requested',
      title: action === 'approve' ? 'Client approved content' : 'Client requested content revision',
      message: `Content #${contentId}${feedback ? ` — "${feedback}"` : ''}`,
      priority: action === 'request_revision' ? 'high' : 'normal',
      clientId,
      actionUrl: '/admin/content',
    });

    // Fire-and-forget email to team
    const emailData = contentActionEmail({
      contentTitle: content.id,
      platform: '',
      action: action === 'approve' ? 'approved' : 'revision_requested',
      clientFeedback: feedback || undefined,
    });
    notifyTeam(emailData.subject, emailData.html);

    return NextResponse.json({ success: true, data: { status: updates.status } });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 });
  }
}

/**
 * Transform Supabase content row for client view
 */
function transformContentForClient(data: any): any {
  const hashtags = Array.isArray(data.hashtags) ? data.hashtags : [];
  const tags = Array.isArray(data.tags) ? data.tags : [];
  const engagement = typeof data.engagement === 'object' ? data.engagement : undefined;

  return {
    id: data.id || '',
    projectId: data.project_id || '',

    title: data.title || 'Untitled Content',
    description: data.description || '',
    content: data.content || '',
    type: data.type || 'post',
    platform: data.platform || 'instagram',

    scheduledDate: data.scheduled_date || '',
    publishedDate: data.published_date || undefined,
    status: data.status || 'draft',

    author: data.author || '',
    imageUrl: data.image_url || undefined,
    videoUrl: data.video_url || undefined,

    clientFeedback: data.client_feedback || undefined,
    revisionNotes: data.revision_notes || undefined,
    approvedAt: data.approved_at || undefined,

    engagement,
    hashtags,
    tags,
    createdAt: data.created_at || '',
    updatedAt: data.updated_at || ''
  };
}
