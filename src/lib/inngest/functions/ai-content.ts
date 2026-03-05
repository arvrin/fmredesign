/**
 * Inngest Function: AI Content Generation
 * Async LLM content generation with durable steps.
 * Removes the maxDuration=60 timeout constraint.
 */

import { inngest } from '../client';
import { getSupabaseAdmin } from '@/lib/supabase';
import { ProjectUtils } from '@/lib/admin/project-types';
import type { Platform, ContentType } from '@/lib/admin/project-types';
import { generateCalendar } from '@/lib/ai/generators/calendar';
import { generateSinglePost } from '@/lib/ai/generators/single-post';
import { getDefaultConfig } from '@/lib/ai/providers';

export const generateAIContentFn = inngest.createFunction(
  { id: 'generate-ai-content', retries: 1 },
  { event: 'ai/generate-content' },
  async ({ event, step }) => {
    const { mode, clientId, options, batchId, triggeredBy, ipAddress } = event.data;

    const config = getDefaultConfig();

    // Step 1: Generate content via LLM
    const generated = await step.run('call-llm', async () => {
      if (mode === 'single') {
        const platform = (options?.platform || 'instagram') as Platform;
        const type = (options?.type || 'post') as ContentType;

        const result = await generateSinglePost(clientId, {
          platform,
          type,
          topic: options?.topic,
          pillar: options?.pillar,
          scheduledDate: options?.scheduledDate,
        });

        return { items: [result], strategy: `Generated a single ${result.type} for ${result.platform}` };
      }

      // Monthly or weekly
      const startDate = options?.startDate || new Date().toISOString().split('T')[0];
      return await generateCalendar(clientId, {
        mode,
        startDate,
        endDate: options?.endDate,
        platforms: options?.platforms as ('instagram' | 'facebook')[] | undefined,
        postsPerWeek: options?.postsPerWeek,
      });
    });

    // Step 2: Insert records into content_calendar
    await step.run('insert-records', async () => {
      const supabase = getSupabaseAdmin();
      const records = generated.items.map((item: Record<string, unknown>) => ({
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

      const { error } = await supabase.from('content_calendar').insert(records);
      if (error) throw new Error(`Content insert failed: ${error.message}`);
    });

    // Step 3: Audit log
    await step.run('audit-log', async () => {
      const supabase = getSupabaseAdmin();
      await supabase.from('admin_audit_log').insert({
        user_id: triggeredBy.userId,
        user_name: triggeredBy.userName,
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
        ip_address: ipAddress || null,
      });
    });

    return {
      success: true,
      batchId,
      itemCount: generated.items.length,
      strategy: generated.strategy,
    };
  }
);
