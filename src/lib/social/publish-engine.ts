/**
 * Social Publishing Engine
 * Orchestrates publishing a content_calendar item to the correct platform.
 * Handles token decryption, platform dispatch, and DB updates.
 */

import { getSupabaseAdmin } from '@/lib/supabase';
import { decryptToken } from './token-crypto';
import { publishToFacebook, publishToInstagram } from './meta-api';
import type { PublishResult, SocialPlatform } from './types';

/**
 * Publish a content calendar item to its target social platform.
 * Returns the PublishResult with success/failure + post ID.
 */
export async function publishContentItem(contentId: string): Promise<PublishResult> {
  const supabase = getSupabaseAdmin();

  // 1. Fetch the content item
  const { data: content, error: contentError } = await supabase
    .from('content_calendar')
    .select('*')
    .eq('id', contentId)
    .single();

  if (contentError || !content) {
    return {
      success: false,
      error: 'Content item not found',
      platform: 'facebook',
      contentId,
    };
  }

  const platform = content.platform as SocialPlatform;

  if (platform !== 'instagram' && platform !== 'facebook') {
    return {
      success: false,
      error: `Platform "${content.platform}" is not supported for social publishing`,
      platform: platform || 'facebook',
      contentId,
    };
  }

  // 2. Check content isn't already published
  if (content.meta_post_id) {
    return {
      success: false,
      error: 'Content has already been published to this platform',
      platform,
      contentId,
    };
  }

  // 3. Find the active social account for this client + platform
  const { data: account, error: accountError } = await supabase
    .from('social_accounts')
    .select('*')
    .eq('client_id', content.client_id)
    .eq('platform', platform)
    .eq('is_active', true)
    .limit(1)
    .single();

  if (accountError || !account) {
    return {
      success: false,
      error: `No connected ${platform} account found for this client. Connect one in Settings > Social Media.`,
      platform,
      contentId,
    };
  }

  // 4. Decrypt the access token
  let accessToken: string;
  try {
    accessToken = decryptToken(account.access_token);
  } catch {
    return {
      success: false,
      error: 'Failed to decrypt access token. The token may need to be re-entered.',
      platform,
      contentId,
    };
  }

  // 5. Build the caption (content + hashtags)
  const hashtags = (content.hashtags || [])
    .map((tag: string) => (tag.startsWith('#') ? tag : `#${tag}`))
    .join(' ');
  const mentions = (content.mentions || [])
    .map((m: string) => (m.startsWith('@') ? m : `@${m}`))
    .join(' ');
  const caption = [content.content, hashtags, mentions].filter(Boolean).join('\n\n');

  // 6. Dispatch to the correct platform
  let result: PublishResult;

  if (platform === 'instagram') {
    if (!account.instagram_account_id) {
      return {
        success: false,
        error: 'No Instagram Business Account linked to this Facebook Page. Re-connect the account.',
        platform,
        contentId,
      };
    }

    result = await publishToInstagram({
      igAccountId: account.instagram_account_id,
      accessToken,
      caption,
      imageUrl: content.image_url || undefined,
      videoUrl: content.video_url || undefined,
      contentType: content.type,
    });
  } else {
    result = await publishToFacebook({
      pageId: account.page_id,
      accessToken,
      message: caption,
      imageUrl: content.image_url || undefined,
      videoUrl: content.video_url || undefined,
    });
  }

  result.contentId = contentId;

  // 7. Update the content item in the database
  const now = new Date().toISOString();

  if (result.success) {
    const { error: updateError } = await supabase
      .from('content_calendar')
      .update({
        status: 'published',
        meta_post_id: result.postId,
        published_date: now,
        last_publish_error: null,
      })
      .eq('id', contentId);

    if (updateError) {
      console.error('CRITICAL: Published to Meta but failed to save meta_post_id:', updateError, 'postId:', result.postId);
    }

    // Update last_used_at on the social account (non-critical)
    await supabase
      .from('social_accounts')
      .update({ last_used_at: now })
      .eq('id', account.id);
  } else {
    await supabase
      .from('content_calendar')
      .update({
        last_publish_error: result.error || 'Unknown error',
      })
      .eq('id', contentId);
  }

  return result;
}
