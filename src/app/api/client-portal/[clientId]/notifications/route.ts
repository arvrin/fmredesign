import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireClientAuth } from '@/lib/client-session';
import { resolveClientId } from '@/lib/client-portal/resolve-client';
import { transformNotification } from '@/lib/notifications';

/**
 * GET /api/client-portal/[clientId]/notifications
 * List notifications for a specific client.
 * Query params: ?unread=true&limit=20
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;

  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  const resolved = await resolveClientId(clientId);
  if (!resolved) {
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unread') === 'true';
  const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100);

  try {
    const supabase = getSupabaseAdmin();

    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient_type', 'client')
      .eq('client_id', resolved.id)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Unread count
    const { count } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('recipient_type', 'client')
      .eq('client_id', resolved.id)
      .eq('is_read', false);

    return NextResponse.json({
      success: true,
      data: (data || []).map(transformNotification),
      unreadCount: count || 0,
    });
  } catch (err) {
    console.error('Error fetching client notifications:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

/**
 * PUT /api/client-portal/[clientId]/notifications
 * Mark notifications as read.
 * Body: { ids: string[] } or { markAllRead: true }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const { clientId } = await params;

  const authError = await requireClientAuth(request, clientId);
  if (authError) return authError;

  const resolved = await resolveClientId(clientId);
  if (!resolved) {
    return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();

    if (body.markAllRead) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: now })
        .eq('recipient_type', 'client')
        .eq('client_id', resolved.id)
        .eq('is_read', false);
    } else if (body.ids && Array.isArray(body.ids)) {
      // Only mark notifications belonging to this client
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: now })
        .in('id', body.ids)
        .eq('client_id', resolved.id);
    } else {
      return NextResponse.json({ success: false, error: 'Provide ids or markAllRead' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error marking notifications read:', err);
    return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 });
  }
}
