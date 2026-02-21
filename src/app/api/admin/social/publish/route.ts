/**
 * Publish Now API
 * Immediately publishes a content calendar item to its social platform.
 *
 * POST /api/admin/social/publish
 * Body: { contentId: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth-middleware';
import { publishContentItem } from '@/lib/social/publish-engine';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'content.publish');
  if ('error' in auth) return auth.error;

  try {
    const { contentId } = await request.json();

    if (!contentId || typeof contentId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Content ID is required' },
        { status: 400 }
      );
    }

    const result = await publishContentItem(contentId);

    // Audit log regardless of outcome
    await logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'publish',
      resource_type: 'content',
      resource_id: contentId,
      details: {
        platform: result.platform,
        success: result.success,
        postId: result.postId,
        error: result.error,
      },
      ip_address: getClientIP(request),
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error, data: result },
        { status: 422 }
      );
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error publishing content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to publish content' },
      { status: 500 }
    );
  }
}
