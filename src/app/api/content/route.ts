/**
 * Content Calendar API Routes
 * Handles CRUD operations for content management (Supabase)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { ProjectUtils } from '@/lib/admin/project-types';
import { requireAdminAuth, requirePermission } from '@/lib/admin-auth-middleware';
import { createContentSchema, updateContentSchema, validateBody } from '@/lib/validations/schemas';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';
import { notifyClient } from '@/lib/notifications';

// GET /api/content
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId');
    const clientId = searchParams.get('clientId');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const platform = searchParams.get('platform');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sortBy = searchParams.get('sortBy') || 'scheduled_date';
    const sortDirection = searchParams.get('sortDirection') || 'asc';

    const supabase = getSupabaseAdmin();
    let query = supabase.from('content_calendar').select('*');

    if (projectId) query = query.eq('project_id', projectId);
    if (clientId) query = query.eq('client_id', clientId);
    if (status) query = query.in('status', status.split(','));
    if (type) query = query.in('type', type.split(','));
    if (platform) query = query.in('platform', platform.split(','));
    if (startDate) query = query.gte('scheduled_date', startDate);
    if (endDate) query = query.lte('scheduled_date', endDate);

    const sortFieldMap: Record<string, string> = {
      scheduledDate: 'scheduled_date',
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    };
    const dbSortField = sortFieldMap[sortBy] || sortBy;
    query = query.order(dbSortField, { ascending: sortDirection === 'asc' });

    const { data, error } = await query;
    if (error) throw error;

    // Transform to camelCase for frontend
    const contentItems = (data || []).map((item) => ({
      id: item.id,
      projectId: item.project_id,
      clientId: item.client_id,
      title: item.title,
      description: item.description,
      content: item.content,
      type: item.type,
      platform: item.platform,
      scheduledDate: item.scheduled_date,
      publishedDate: item.published_date,
      status: item.status,
      author: item.author,
      assignedDesigner: item.assigned_designer,
      assignedWriter: item.assigned_writer,
      imageUrl: item.image_url,
      videoUrl: item.video_url,
      clientFeedback: item.client_feedback,
      revisionNotes: item.revision_notes,
      approvedAt: item.approved_at,
      hashtags: item.hashtags || [],
      mentions: item.mentions || [],
      tags: item.tags || [],
      files: item.files || [],
      engagement: item.engagement || null,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    }));

    return NextResponse.json({
      success: true,
      data: contentItems,
      total: contentItems.length,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}

// POST /api/content
export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'content.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(createContentSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = rawBody;

    const record = {
      id: ProjectUtils.generateContentId(),
      project_id: body.projectId,
      client_id: body.clientId || '',
      title: body.title.trim(),
      description: body.description?.trim() || '',
      content: body.content?.trim() || '',
      type: body.type,
      platform: body.platform,
      scheduled_date: body.scheduledDate,
      status: 'draft',
      assigned_designer: body.assignedDesigner || null,
      assigned_writer: body.assignedWriter || null,
      hashtags: body.hashtags || [],
      mentions: body.mentions || [],
      tags: body.tags || [],
      files: [],
    };

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase.from('content_calendar').insert(record).select().single();

    if (error) throw error;

    const newContent = {
      id: data.id,
      projectId: data.project_id,
      clientId: data.client_id,
      title: data.title,
      description: data.description,
      content: data.content,
      type: data.type,
      platform: data.platform,
      scheduledDate: data.scheduled_date,
      status: data.status,
      assignedDesigner: data.assigned_designer,
      assignedWriter: data.assigned_writer,
      hashtags: data.hashtags || [],
      mentions: data.mentions || [],
      tags: data.tags || [],
      files: data.files || [],
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Fire-and-forget audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'create',
      resource_type: 'content',
      resource_id: data.id,
      details: { title: data.title, platform: data.platform, type: data.type },
      ip_address: getClientIP(request),
    });

    // Notify client about new content (especially if in review status)
    if (data.client_id) {
      notifyClient(data.client_id, {
        type: 'content_created',
        title: data.status === 'review' ? 'Content ready for your review' : 'New content scheduled',
        message: `${data.title} — ${data.platform}`,
        priority: data.status === 'review' ? 'high' : 'normal',
        actionUrl: `/client/${data.client_id}/content`,
      });
    }

    return NextResponse.json(
      { success: true, data: newContent, message: 'Content created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create content' },
      { status: 500 }
    );
  }
}

// PUT /api/content
export async function PUT(request: NextRequest) {
  const auth = await requirePermission(request, 'content.write');
  if ('error' in auth) return auth.error;

  try {
    const rawBody = await request.json();
    const validation = validateBody(updateContentSchema, rawBody);
    if (!validation.success) {
      return NextResponse.json({ success: false, error: validation.error }, { status: 400 });
    }
    const body = rawBody;

    const updates: Record<string, any> = {};
    if (body.title !== undefined) updates.title = body.title;
    if (body.description !== undefined) updates.description = body.description;
    if (body.content !== undefined) updates.content = body.content;
    if (body.status !== undefined) updates.status = body.status;
    if (body.scheduledDate !== undefined) updates.scheduled_date = body.scheduledDate;
    if (body.assignedDesigner !== undefined) updates.assigned_designer = body.assignedDesigner;
    if (body.assignedWriter !== undefined) updates.assigned_writer = body.assignedWriter;
    if (body.clientFeedback !== undefined) updates.client_feedback = body.clientFeedback;
    if (body.revisionNotes !== undefined) updates.revision_notes = body.revisionNotes;
    if (body.hashtags !== undefined) updates.hashtags = body.hashtags;
    if (body.mentions !== undefined) updates.mentions = body.mentions;
    if (body.tags !== undefined) updates.tags = body.tags;
    if (body.files !== undefined) updates.files = body.files;
    if (body.engagement !== undefined) updates.engagement = body.engagement;

    // Handle status changes
    if (body.status === 'approved') updates.approved_at = new Date().toISOString();
    if (body.status === 'published') updates.published_date = new Date().toISOString();

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from('content_calendar')
      .update(updates)
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return NextResponse.json(
        { success: false, error: 'Content not found' },
        { status: 404 }
      );
    }

    const responseContent = {
      id: data.id,
      projectId: data.project_id,
      clientId: data.client_id,
      title: data.title,
      description: data.description,
      content: data.content,
      type: data.type,
      platform: data.platform,
      scheduledDate: data.scheduled_date,
      publishedDate: data.published_date,
      status: data.status,
      assignedDesigner: data.assigned_designer,
      assignedWriter: data.assigned_writer,
      clientFeedback: data.client_feedback,
      revisionNotes: data.revision_notes,
      approvedAt: data.approved_at,
      hashtags: data.hashtags || [],
      mentions: data.mentions || [],
      tags: data.tags || [],
      files: data.files || [],
      engagement: data.engagement || null,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };

    // Fire-and-forget audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: body.status === 'approved' ? 'approve' : 'update',
      resource_type: 'content',
      resource_id: data.id,
      details: { title: data.title, updatedFields: Object.keys(updates) },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      data: responseContent,
      message: 'Content updated successfully',
    });
  } catch (error) {
    console.error('Error updating content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}

// DELETE /api/content
export async function DELETE(request: NextRequest) {
  const auth = await requirePermission(request, 'content.delete');
  if ('error' in auth) return auth.error;

  try {
    const searchParams = request.nextUrl.searchParams;
    const contentId = searchParams.get('id');

    if (!contentId) {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();
    const { error } = await supabase.from('content_calendar').delete().eq('id', contentId);

    if (error) throw error;

    // Fire-and-forget audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'delete',
      resource_type: 'content',
      resource_id: contentId,
      details: {},
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      message: 'Content deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete content' },
      { status: 500 }
    );
  }
}
