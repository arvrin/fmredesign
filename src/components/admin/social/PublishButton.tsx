/**
 * Publish Now button for content calendar items.
 * Only renders for instagram/facebook content that hasn't been published yet.
 */

'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import type { ContentStatus, Platform } from '@/lib/admin/project-types';

interface PublishButtonProps {
  contentId: string;
  contentStatus: ContentStatus;
  platform: Platform;
  clientId: string;
  metaPostId?: string;
  publishError?: string;
  onPublished: () => void;
}

export function PublishButton({
  contentId,
  contentStatus,
  platform,
  clientId,
  metaPostId,
  publishError,
  onPublished,
}: PublishButtonProps) {
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(publishError || '');

  // Only render for supported platforms
  if (platform !== 'instagram' && platform !== 'facebook') {
    return null;
  }

  // Already published
  if (metaPostId) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span className="text-sm font-medium">Published to {platform}</span>
        </div>
        <p className="text-xs text-fm-neutral-500 font-mono truncate">
          Post ID: {metaPostId}
        </p>
      </div>
    );
  }

  // Can only publish approved or scheduled content
  const canPublish = contentStatus === 'approved' || contentStatus === 'scheduled';

  if (!canPublish) {
    return (
      <p className="text-sm text-fm-neutral-500">
        Content must be approved before publishing to {platform}.
      </p>
    );
  }

  const handlePublish = async () => {
    setPublishing(true);
    setError('');

    try {
      const res = await fetch('/api/admin/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentId }),
      });
      const result = await res.json();

      if (result.success) {
        onPublished();
      } else {
        setError(result.error || 'Publishing failed');
      }
    } catch {
      setError('Network error — please try again');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-3">
      <DashboardButton
        variant="primary"
        size="sm"
        onClick={handlePublish}
        disabled={publishing}
        className="w-full"
      >
        {publishing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Publishing...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Publish to {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </>
        )}
      </DashboardButton>

      {error && (
        <div className="flex items-start gap-2 text-red-700 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}
