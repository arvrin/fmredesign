/**
 * Compact publish status indicator for the content list view.
 * Shows "Live" (green), "Failed" (red), or nothing.
 */

'use client';

import { CheckCircle, AlertCircle } from 'lucide-react';
import type { Platform } from '@/lib/admin/project-types';

interface SocialPublishStatusProps {
  platform: Platform;
  metaPostId?: string;
  publishError?: string;
}

export function SocialPublishStatus({
  platform,
  metaPostId,
  publishError,
}: SocialPublishStatusProps) {
  // Only show for social platforms
  if (platform !== 'instagram' && platform !== 'facebook') return null;

  if (metaPostId) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
        <CheckCircle className="h-3 w-3" />
        Live
      </span>
    );
  }

  if (publishError) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-700 bg-red-50 px-2 py-0.5 rounded-full border border-red-200" title={publishError}>
        <AlertCircle className="h-3 w-3" />
        Failed
      </span>
    );
  }

  return null;
}
