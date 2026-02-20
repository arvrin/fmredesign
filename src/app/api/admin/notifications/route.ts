import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireAdminAuth } from '@/lib/admin-auth-middleware';
import { transformNotification } from '@/lib/notifications';

/**
 * GET /api/admin/notifications
 * List notifications for admin users.
 * Query params: ?unread=true&limit=20
 */
export async function GET(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unread') === 'true';
  const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100);

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient_type', 'admin')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Also get unread count
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_type', 'admin')
      .eq('is_read', false);

    return NextResponse.json({
      success: true,
      data: (data || []).map(transformNotification),
      unreadCount: count || 0,
    });
  } catch (err) {
    console.error('Error fetching admin notifications:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/notifications
 * Mark notifications as read.
 * Body: { ids: string[] } or { markAllRead: true }
 */
export async function PUT(request: NextRequest) {
  const authError = await requireAdminAuth(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (body.markAllRead) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: now })
        .eq('recipient_type', 'admin')
        .eq('is_read', false);
    } else if (body.ids && Array.isArray(body.ids)) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: now })
        .in('id', body.ids);
    } else {
      return NextResponse.json({ success: false, error: 'Provide ids or markAllRead' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error marking notifications read:', err);
    return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 });
  }
}
