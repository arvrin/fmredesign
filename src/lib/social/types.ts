/**
 * Social Media Publishing Types
 * Used by the Meta Graph API integration for Instagram + Facebook publishing.
 */

export type SocialPlatform = 'instagram' | 'facebook';

export interface SocialAccount {
  id: string;
  clientId: string;
  platform: SocialPlatform;
  pageId: string;
  pageName: string;
  instagramAccountId?: string;
  isActive: boolean;
  connectedAt: string;
  connectedBy: string;
  lastUsedAt?: string;
  // access_token is NEVER returned to the client
}

export interface SocialAccountInput {
  clientId: string;
  platform: SocialPlatform;
  pageId: string;
  pageName: string;
  instagramAccountId?: string;
  accessToken: string;
}

export interface PublishResult {
  success: boolean;
  postId?: string;
  error?: string;
  platform: SocialPlatform;
  contentId: string;
}

export interface MetaPageInfo {
  id: string;
  name: string;
  instagram_business_account?: { id: string };
}
