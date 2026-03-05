/**
 * Inngest Function: Social Publishing
 * Multi-step durable function: fetch content -> fetch account -> publish -> update DB -> audit.
 * Fixes data integrity risk where Meta publish succeeds but DB update fails.
 */

import { inngest } from '../client';
import { getSupabaseAdmin } from '@/lib/supabase';
import { decryptToken } from '@/lib/social/token-crypto';
import { publishToFacebook, publishToInstagram } from '@/lib/social/meta-api';
import type { PublishResult, SocialPlatform } from '@/lib/social/types';

export const publishToSocialFn = inngest.createFunction(
  { id: 'publish-to-social', retries: 2 },
  { event: 'social/publish' },
  async ({ event, step }) => {
    const { contentId, triggeredBy, ipAddress } = event.data;

    // Step 1: Fetch the content item
    const content = await step.run('fetch-content', async () => {
      const supabase = getSupabaseAdmin();
      const { data, error } = await supabase
        .from('content_calendar')
        .select('*')
        .eq('id', contentId)
        .single();

      if (error || !data) throw new Error('Content item not found');
      if (data.meta_post_id) throw new Error('Content has already been published');

      const platform = data.platform as SocialPlatform;
      if (platform !== 'instagram' && platform !== 'facebook') {
        throw new Error(`Platform "${data.platform}" is not supported for social publishing`);
      }

      return data;
    });

    // Step 2: Fetch the social account + decrypt token
    const accountInfo = await step.run('fetch-account', async () => {
      const supabase = getSupabaseAdmin();
      const { data: account, error } = await supabase
        .from('social_accounts')
        .select('*')
        .eq('client_id', content.client_id)
        .eq('platform', content.platform)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error || !account) {
        throw new Error(`No connected ${content.platform} account found for this client`);
      }

      const accessToken = decryptToken(account.access_token);
      return {
        id: account.id,
        pageId: account.page_id,
        instagramAccountId: account.instagram_account_id,
        accessToken,
      };
    });

    // Step 3: Publish to Meta
    const result = await step.run('publish-to-meta', async () => {
      const hashtags = (content.hashtags || [])
        .map((tag: string) => (tag.startsWith('#') ? tag : `#${tag}`))
        .join(' ');
      const mentions = (content.mentions || [])
        .map((m: string) => (m.startsWith('@') ? m : `@${m}`))
        .join(' ');
      const caption = [content.content, hashtags, mentions].filter(Boolean).join('\n\n');

      let publishResult: PublishResult;

      if (content.platform === 'instagram') {
        if (!accountInfo.instagramAccountId) {
          throw new Error('No Instagram Business Account linked to this Facebook Page');
        }
        publishResult = await publishToInstagram({
          igAccountId: accountInfo.instagramAccountId,
          accessToken: accountInfo.accessToken,
          caption,
          imageUrl: content.image_url || undefined,
          videoUrl: content.video_url || undefined,
          contentType: content.type,
        });
      } else {
        publishResult = await publishToFacebook({
          pageId: accountInfo.pageId,
          accessToken: accountInfo.accessToken,
          message: caption,
          imageUrl: content.image_url || undefined,
          videoUrl: content.video_url || undefined,
        });
      }

      publishResult.contentId = contentId;
      return publishResult;
    });

    // Step 4: Update DB with result
    await step.run('update-database', async () => {
      const supabase = getSupabaseAdmin();
      const now = new Date().toISOString();

      if (result.success) {
        const { error } = await supabase
          .from('content_calendar')
          .update({
            status: 'published',
            meta_post_id: result.postId,
            published_date: now,
            last_publish_error: null,
          })
          .eq('id', contentId);

        if (error) {
          throw new Error(`Failed to save meta_post_id: ${error.message}`);
        }

        await supabase
          .from('social_accounts')
          .update({ last_used_at: now })
          .eq('id', accountInfo.id);
      } else {
        await supabase
          .from('content_calendar')
          .update({ last_publish_error: result.error || 'Unknown error' })
          .eq('id', contentId);
      }
    });

    // Step 5: Audit log
    await step.run('audit-log', async () => {
      const supabase = getSupabaseAdmin();
      await supabase.from('admin_audit_log').insert({
        user_id: triggeredBy.userId,
        user_name: triggeredBy.userName,
        action: 'publish',
        resource_type: 'content',
        resource_id: contentId,
        details: {
          platform: result.platform,
          success: result.success,
          postId: result.postId,
          error: result.error,
        },
        ip_address: ipAddress || null,
      });
    });

    return result;
  }
);
