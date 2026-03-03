/**
 * Output Schema for AI Content Generation
 * Defines the JSON structure the LLM must follow
 */

import type { ContentType, Platform } from '@/lib/admin/project-types';

export interface GeneratedContentItem {
  title: string;
  content: string;
  type: ContentType;
  platform: Platform;
  scheduledDate: string;
  hashtags: string[];
  mentions: string[];
  contentPillar: string;
  visualDirection?: string;
  designerNotes?: string;
  ctaText?: string;
}

export interface GeneratedCalendar {
  items: GeneratedContentItem[];
  strategy: string;
  pillarBreakdown: Record<string, number>;
}

export function getCalendarOutputSchema(): string {
  return `Respond with a JSON object matching this EXACT structure:

{
  "items": [
    {
      "title": "Short post title (max 60 chars)",
      "content": "Full caption/copy ready to publish. Include line breaks, emojis (if allowed), and CTA.",
      "type": "post|story|reel|carousel|video|article|ad|email",
      "platform": "instagram|facebook|linkedin|twitter|youtube|tiktok|website|email",
      "scheduledDate": "YYYY-MM-DD",
      "hashtags": ["hashtag1", "hashtag2"],
      "mentions": ["@mention1"],
      "contentPillar": "Name of the content pillar this post belongs to",
      "visualDirection": "Brief description of the visual/image needed",
      "designerNotes": "Specific notes for the designer (colors, layout, imagery style)",
      "ctaText": "The call-to-action text"
    }
  ],
  "strategy": "1-3 sentence explanation of the overall content strategy for this period",
  "pillarBreakdown": {
    "Pillar Name": 5
  }
}

RULES:
- "items" must contain the requested number of posts
- "scheduledDate" must be within the requested date range
- "type" must be one of: post, story, reel, carousel, video, article, ad, email
- "platform" must be one of: instagram, facebook, linkedin, twitter, youtube, tiktok, website, email
- "contentPillar" must match one of the client's defined content pillars (if provided)
- "pillarBreakdown" maps each pillar name to the count of posts assigned to it
- Every field shown above must be present (visualDirection, designerNotes, ctaText can be null)`;
}

export function getSinglePostOutputSchema(): string {
  return `Respond with a JSON object matching this EXACT structure:

{
  "title": "Short post title (max 60 chars)",
  "content": "Full caption/copy ready to publish",
  "type": "post|story|reel|carousel|video|article|ad|email",
  "platform": "instagram|facebook|linkedin|twitter|youtube|tiktok|website|email",
  "scheduledDate": "YYYY-MM-DD",
  "hashtags": ["hashtag1", "hashtag2"],
  "mentions": ["@mention1"],
  "contentPillar": "Name of the content pillar",
  "visualDirection": "Brief description of the visual/image needed",
  "designerNotes": "Specific notes for the designer",
  "ctaText": "The call-to-action text"
}`;
}
