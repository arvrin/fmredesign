import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase';
import { requireTalentAuth } from '@/lib/talent-session';
import { transformNotification } from '@/lib/notifications';

/**
 * GET /api/talent/[slug]/notifications
 * List notifications for an authenticated talent user.
 * Query params: ?unread=true&limit=20
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const authError = await requireTalentAuth(request, slug);
  if (authError) return authError;

  // Resolve talent profile ID from slug
  const supabase = getSupabaseAdmin();
  const { data: profile } = await supabase
    .from('talent_profiles')
    .select('id')
    .eq('profile_slug', slug)
    .single();

  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const unreadOnly = searchParams.get('unread') === 'true';
  const limit = Math.min(parseInt(searchParams.get('limit') || '30', 10), 100);

  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('recipient_type', 'talent')
      .eq('talent_id', profile.id)
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
      .eq('recipient_type', 'talent')
      .eq('talent_id', profile.id)
      .eq('is_read', false);

    return NextResponse.json({
      success: true,
      data: (data || []).map(transformNotification),
      unreadCount: count || 0,
    });
  } catch (err) {
    console.error('Error fetching talent notifications:', err);
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

/**
 * PUT /api/talent/[slug]/notifications
 * Mark notifications as read.
 * Body: { ids: string[] } or { markAllRead: true }
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const authError = await requireTalentAuth(request, slug);
  if (authError) return authError;

  const supabase = getSupabaseAdmin();
  const { data: profile } = await supabase
    .from('talent_profiles')
    .select('id')
    .eq('profile_slug', slug)
    .single();

  if (!profile) {
    return NextResponse.json({ success: false, error: 'Profile not found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    const now = new Date().toISOString();

    if (body.markAllRead) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: now })
        .eq('recipient_type', 'talent')
        .eq('talent_id', profile.id)
        .eq('is_read', false);
    } else if (body.ids && Array.isArray(body.ids)) {
      await supabase
        .from('notifications')
        .update({ is_read: true, read_at: now })
        .in('id', body.ids)
        .eq('talent_id', profile.id);
    } else {
      return NextResponse.json({ success: false, error: 'Provide ids or markAllRead' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error marking talent notifications read:', err);
    return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 });
  }
}
