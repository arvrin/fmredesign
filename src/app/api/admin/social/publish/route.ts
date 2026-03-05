/**
 * Publish Now API
 * Queues content for async publishing via Inngest durable function.
 * Returns immediately with { status: 'queued' }.
 *
 * POST /api/admin/social/publish
 * Body: { contentId: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth-middleware';
import { getClientIP } from '@/lib/admin/audit-log';
import { inngest } from '@/lib/inngest/client';

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

    await inngest.send({
      name: 'social/publish',
      data: {
        contentId,
        triggeredBy: { userId: auth.user.id, userName: auth.user.name },
        ipAddress: getClientIP(request),
      },
    });

    return NextResponse.json({
      success: true,
      status: 'queued',
      message: 'Content queued for publishing',
    });
  } catch (error) {
    console.error('Error queuing content publish:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to queue content for publishing' },
      { status: 500 }
    );
  }
}
