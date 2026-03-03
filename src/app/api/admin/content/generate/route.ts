/**
 * AI Content Generation API
 * Direct in-app LLM content generation (replaces n8n fire-and-forget).
 * Synchronous — returns generated content in the response.
 */

import { NextRequest, NextResponse } from 'next/server';
import { requirePermission } from '@/lib/admin-auth-middleware';
import { getSupabaseAdmin } from '@/lib/supabase';
import { logAuditEvent, getClientIP } from '@/lib/admin/audit-log';
import { ProjectUtils } from '@/lib/admin/project-types';
import type { Platform, ContentType } from '@/lib/admin/project-types';
import { generateCalendar } from '@/lib/ai/generators/calendar';
import { generateSinglePost } from '@/lib/ai/generators/single-post';
import { getDefaultConfig } from '@/lib/ai/providers';

// Extend timeout for LLM calls (Vercel)
export const maxDuration = 60;

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
    const config = getDefaultConfig();

    if (mode === 'single') {
      // Single post generation
      const platform = options?.platform || 'instagram';
      const type = options?.type || 'post';

      const generated = await generateSinglePost(clientId, {
        platform,
        type,
        topic: options?.topic,
        pillar: options?.pillar,
        scheduledDate: options?.scheduledDate,
      });

      // Insert into content_calendar
      const supabase = getSupabaseAdmin();
      const record = {
        id: ProjectUtils.generateContentId(),
        client_id: clientId,
        project_id: '',
        title: generated.title,
        description: generated.visualDirection || '',
        content: generated.content,
        type: generated.type,
        platform: generated.platform,
        scheduled_date: generated.scheduledDate,
        status: 'draft',
        hashtags: generated.hashtags || [],
        mentions: generated.mentions || [],
        tags: [],
        files: [],
        ai_generated: true,
        ai_generation_batch_id: batchId,
        generation_source: 'single',
        content_pillar: generated.contentPillar || null,
        generation_metadata: {
          model: config.model,
          provider: config.provider,
          promptVersion: '1.0',
          generatedAt: new Date().toISOString(),
          batchId,
          mode: 'single',
        },
      };

      const { error: insertError } = await supabase
        .from('content_calendar')
        .insert(record);

      if (insertError) throw insertError;

      // Audit log
      logAuditEvent({
        user_id: auth.user.id,
        user_name: auth.user.name,
        action: 'ai_generate',
        resource_type: 'content',
        resource_id: record.id,
        details: { mode, clientId, batchId, model: config.model },
        ip_address: getClientIP(request),
      });

      return NextResponse.json({
        success: true,
        items: [generated],
        batchId,
        strategy: `Generated a single ${generated.type} for ${generated.platform}`,
      });
    }

    // Monthly or weekly calendar generation
    const startDate =
      options?.startDate || new Date().toISOString().split('T')[0];

    const generated = await generateCalendar(clientId, {
      mode,
      startDate,
      endDate: options?.endDate,
      platforms: options?.platforms,
      postsPerWeek: options?.postsPerWeek,
    });

    // Insert all generated items into content_calendar
    const supabase = getSupabaseAdmin();
    const records = generated.items.map((item) => ({
      id: ProjectUtils.generateContentId(),
      client_id: clientId,
      project_id: '',
      title: item.title,
      description: item.visualDirection || '',
      content: item.content,
      type: item.type,
      platform: item.platform,
      scheduled_date: item.scheduledDate,
      status: 'draft',
      hashtags: item.hashtags || [],
      mentions: item.mentions || [],
      tags: [],
      files: [],
      ai_generated: true,
      ai_generation_batch_id: batchId,
      generation_source: mode,
      content_pillar: item.contentPillar || null,
      generation_metadata: {
        model: config.model,
        provider: config.provider,
        promptVersion: '1.0',
        generatedAt: new Date().toISOString(),
        batchId,
        mode,
      },
    }));

    const { error: insertError } = await supabase
      .from('content_calendar')
      .insert(records);

    if (insertError) throw insertError;

    // Audit log
    logAuditEvent({
      user_id: auth.user.id,
      user_name: auth.user.name,
      action: 'ai_generate',
      resource_type: 'content',
      resource_id: batchId,
      details: {
        mode,
        clientId,
        batchId,
        itemCount: generated.items.length,
        model: config.model,
      },
      ip_address: getClientIP(request),
    });

    return NextResponse.json({
      success: true,
      items: generated.items,
      batchId,
      strategy: generated.strategy,
      pillarBreakdown: generated.pillarBreakdown,
    });
  } catch (error) {
    console.error('Error generating content:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to generate content';
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
