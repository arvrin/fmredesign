/**
 * Meta Graph API v21.0 Client
 * Handles Facebook Page and Instagram Content Publishing API calls.
 * No third-party SDK — raw fetch calls only.
 */

import type { MetaPageInfo, PublishResult, SocialPlatform } from './types';

const GRAPH_BASE = 'https://graph.facebook.com/v21.0';

// ---------------------------------------------------------------------------
// Token verification
// ---------------------------------------------------------------------------

/** Verify a Page Access Token and return page info + linked Instagram account. */
export async function verifyPageToken(accessToken: string): Promise<MetaPageInfo> {
  const res = await fetch(`${GRAPH_BASE}/me?fields=id,name,instagram_business_account`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Invalid token');
  }

  return {
    id: data.id,
    name: data.name,
    instagram_business_account: data.instagram_business_account || undefined,
  };
}

// ---------------------------------------------------------------------------
// Facebook Publishing
// ---------------------------------------------------------------------------

export async function publishToFacebook(params: {
  pageId: string;
  accessToken: string;
  message: string;
  imageUrl?: string;
  videoUrl?: string;
}): Promise<PublishResult> {
  const { pageId, accessToken, message, imageUrl, videoUrl } = params;

  try {
    let url: string;
    let body: Record<string, string>;

    if (imageUrl) {
      // Photo post
      url = `${GRAPH_BASE}/${pageId}/photos`;
      body = { url: imageUrl, message, access_token: accessToken };
    } else if (videoUrl) {
      // Video post
      url = `${GRAPH_BASE}/${pageId}/videos`;
      body = { file_url: videoUrl, description: message, access_token: accessToken };
    } else {
      // Text-only post
      url = `${GRAPH_BASE}/${pageId}/feed`;
      body = { message, access_token: accessToken };
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (data.error) {
      return {
        success: false,
        error: data.error.message || 'Facebook publish failed',
        platform: 'facebook',
        contentId: '',
      };
    }

    return {
      success: true,
      postId: data.id || data.post_id,
      platform: 'facebook',
      contentId: '',
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Facebook publish failed',
      platform: 'facebook',
      contentId: '',
    };
  }
}

// ---------------------------------------------------------------------------
// Instagram Publishing (2-step: create container → publish)
// ---------------------------------------------------------------------------

async function createInstagramContainer(params: {
  igAccountId: string;
  accessToken: string;
  imageUrl?: string;
  videoUrl?: string;
  caption: string;
  mediaType: 'IMAGE' | 'VIDEO' | 'REELS';
}): Promise<string> {
  const { igAccountId, accessToken, imageUrl, videoUrl, caption, mediaType } = params;

  const body: Record<string, string> = {
    caption,
    access_token: accessToken,
    media_type: mediaType,
  };

  if (mediaType === 'VIDEO' || mediaType === 'REELS') {
    body.video_url = videoUrl || '';
  } else {
    body.image_url = imageUrl || '';
  }

  const res = await fetch(`${GRAPH_BASE}/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Failed to create Instagram container');
  }

  return data.id;
}

async function pollContainerStatus(
  containerId: string,
  accessToken: string,
  maxWaitMs = 25000
): Promise<void> {
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const res = await fetch(`${GRAPH_BASE}/${containerId}?fields=status_code`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const data = await res.json();

    if (data.status_code === 'FINISHED') return;
    if (data.status_code === 'ERROR') {
      throw new Error('Instagram container processing failed');
    }

    // Poll every 2 seconds
    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error('Instagram container processing timed out');
}

async function publishInstagramContainer(params: {
  igAccountId: string;
  accessToken: string;
  creationId: string;
}): Promise<string> {
  const { igAccountId, accessToken, creationId } = params;

  const res = await fetch(`${GRAPH_BASE}/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      creation_id: creationId,
      access_token: accessToken,
    }),
  });

  const data = await res.json();

  if (data.error) {
    throw new Error(data.error.message || 'Failed to publish Instagram container');
  }

  return data.id;
}

/** Determine the Instagram media type from the content type. */
function getInstagramMediaType(contentType: string): 'IMAGE' | 'VIDEO' | 'REELS' {
  if (contentType === 'reel') return 'REELS';
  if (contentType === 'video') return 'VIDEO';
  return 'IMAGE';
}

export async function publishToInstagram(params: {
  igAccountId: string;
  accessToken: string;
  caption: string;
  imageUrl?: string;
  videoUrl?: string;
  contentType: string;
}): Promise<PublishResult> {
  const { igAccountId, accessToken, caption, imageUrl, videoUrl, contentType } = params;

  try {
    if (!imageUrl && !videoUrl) {
      return {
        success: false,
        error: 'Instagram requires an image or video URL',
        platform: 'instagram',
        contentId: '',
      };
    }

    const mediaType = getInstagramMediaType(contentType);

    // Step 1: Create container
    const containerId = await createInstagramContainer({
      igAccountId,
      accessToken,
      imageUrl,
      videoUrl,
      caption,
      mediaType,
    });

    // Step 2: Poll until ready (mainly for videos)
    if (mediaType === 'VIDEO' || mediaType === 'REELS') {
      await pollContainerStatus(containerId, accessToken);
    }

    // Step 3: Publish
    const postId = await publishInstagramContainer({
      igAccountId,
      accessToken,
      creationId: containerId,
    });

    return {
      success: true,
      postId,
      platform: 'instagram',
      contentId: '',
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Instagram publish failed',
      platform: 'instagram',
      contentId: '',
    };
  }
}
