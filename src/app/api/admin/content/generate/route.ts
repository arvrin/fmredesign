/**
 * AI Content Generation API
 * Queues content generation via Inngest durable function.
 * Returns immediately with { status: 'queued', batchId }.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth-middleware';
import { getClientIP } from '@/lib/admin/audit-log';
import { inngest } from '@/lib/inngest/client';
import type { Platform, ContentType } from '@/lib/admin/project-types';

export async function POST(request: NextRequest) {
  const auth = await requirePermission(request, 'content.write');
  if ('error' in auth) return auth.error;

  try {
    const body = await request.json();
    const { mode, clientId, options } = body as {
      mode?: 'monthly' | 'weekly' | 'single';
      clientId?: string;
      options?: {
        startDate?: string;
        endDate?: string;
        platforms?: Platform[];
        postsPerWeek?: number;
        platform?: Platform;
        type?: ContentType;
        topic?: string;
        pillar?: string;
        scheduledDate?: string;
      };
    };

    if (!mode || !['monthly', 'weekly', 'single'].includes(mode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid mode. Must be: monthly, weekly, or single' },
        { status: 400 }
      );
    }

    if (!clientId) {
      return NextResponse.json(
        { success: false, error: 'clientId is required' },
        { status: 400 }
      );
    }

    const batchId = `batch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await inngest.send({
      name: 'ai/generate-content',
      data: {
        mode,
        clientId,
        options,
        batchId,
        triggeredBy: { userId: auth.user.id, userName: auth.user.name },
        ipAddress: getClientIP(request),
      },
    });

    return NextResponse.json({
      success: true,
      status: 'queued',
      batchId,
      message: `Content generation queued (mode: ${mode})`,
    });
  } catch (error) {
    console.error('Error queuing content generation:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to queue content generation';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
