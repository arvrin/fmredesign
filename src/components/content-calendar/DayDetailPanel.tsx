'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DashboardButton } from '@/design-system';
import { StatusBadge } from '@/components/ui/status-badge';
import { getStatusDotColor, PLATFORM_ABBREV } from './calendar-utils';
import type { CalendarContentItem } from './types';

interface DayDetailPanelProps {
  date: Date;
  items: CalendarContentItem[];
  variant: 'admin' | 'client';
  onClose: () => void;
  onItemClick?: (itemId: string) => void;
  getClientName?: (clientId: string) => string;
}

const TYPE_LABELS: Record<string, string> = {
  post: 'Post',
  story: 'Story',
  reel: 'Reel',
  carousel: 'Carousel',
  video: 'Video',
  article: 'Article',
  ad: 'Ad',
  email: 'Email',
};

export function DayDetailPanel({
  date,
  items,
  variant,
  onClose,
  onItemClick,
  getClientName,
}: DayDetailPanelProps) {
  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="mt-3 rounded-xl border border-fm-neutral-200 bg-white overflow-hidden max-h-[60vh] md:max-h-none flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-fm-neutral-100 bg-fm-neutral-50 shrink-0">
        <div>
          <h3 className="text-sm font-semibold text-fm-neutral-900">
            {dateLabel}
          </h3>
          <p className="text-xs text-fm-neutral-500">
            {items.length} item{items.length !== 1 ? 's' : ''}
          </p>
        </div>
        <DashboardButton variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </DashboardButton>
      </div>

      {/* Content list */}
      <div className="overflow-y-auto divide-y divide-fm-neutral-100">
        {items.length === 0 ? (
          <div className="px-4 py-6 text-sm text-fm-neutral-400 italic" style={{ textAlign: 'center' }}>
            No content scheduled for this day
          </div>
        ) : (
          items.map((item) => (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item.id)}
              className="w-full text-left px-4 py-3 hover:bg-fm-neutral-50/50 transition-colors"
            >
              <div className="flex items-start gap-3">
                <span
                  className={cn(
                    'h-2.5 w-2.5 rounded-full mt-1.5 shrink-0',
                    getStatusDotColor(item.status)
                  )}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-fm-neutral-900 truncate">
                      {item.title}
                    </span>
                    <StatusBadge status={item.status} />
                    <span className="text-xs text-fm-neutral-500 bg-fm-neutral-100 px-1.5 py-0.5 rounded">
                      {TYPE_LABELS[item.type] || item.type}
                    </span>
                    <span className="text-xs text-fm-neutral-500 bg-fm-neutral-100 px-1.5 py-0.5 rounded">
                      {PLATFORM_ABBREV[item.platform.toLowerCase()] || item.platform}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mt-1 text-xs text-fm-neutral-500">
                    {item.scheduledDate && (
                      <span>
                        {new Date(item.scheduledDate).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                    {variant === 'admin' && item.clientId && getClientName && (
                      <span className="text-fm-magenta-600 font-medium">
                        {getClientName(item.clientId)}
                      </span>
                    )}
                  </div>

                  {item.description && (
                    <p className="text-sm text-fm-neutral-500 mt-1 line-clamp-1">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
