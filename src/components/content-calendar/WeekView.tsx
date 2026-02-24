'use client';

import { cn } from '@/lib/utils';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  getWeekDays,
  groupItemsByDate,
  isToday,
  getStatusDotColor,
  PLATFORM_ABBREV,
} from './calendar-utils';
import type { CalendarContentItem } from './types';

interface WeekViewProps {
  weekStart: Date;
  items: CalendarContentItem[];
  variant: 'admin' | 'client';
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

export function WeekView({
  weekStart,
  items,
  variant,
  onItemClick,
  getClientName,
}: WeekViewProps) {
  const days = getWeekDays(weekStart);
  const grouped = groupItemsByDate(items);

  return (
    <div className="space-y-3">
      {days.map((date) => {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayItems = grouped.get(key) || [];
        const today = isToday(date);

        const dayLabel = date.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        });

        return (
          <div
            key={key}
            className={cn(
              'rounded-xl border overflow-hidden',
              today
                ? 'border-fm-magenta-200 bg-fm-magenta-50/30'
                : 'border-fm-neutral-200 bg-white'
            )}
          >
            {/* Day header */}
            <div
              className={cn(
                'px-4 py-2.5 border-b text-sm font-semibold',
                today
                  ? 'border-fm-magenta-200 text-fm-magenta-700 bg-fm-magenta-50/50'
                  : 'border-fm-neutral-100 text-fm-neutral-700 bg-fm-neutral-50'
              )}
            >
              {dayLabel}
              {today && (
                <span className="ml-2 text-xs font-medium text-fm-magenta-500">
                  Today
                </span>
              )}
              {dayItems.length > 0 && (
                <span className="ml-2 text-xs font-normal text-fm-neutral-500">
                  {dayItems.length} item{dayItems.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>

            {/* Content cards or empty */}
            {dayItems.length === 0 ? (
              <div className="px-4 py-4 text-sm text-fm-neutral-400 italic">
                No content scheduled
              </div>
            ) : (
              <div className="divide-y divide-fm-neutral-100">
                {dayItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onItemClick?.(item.id)}
                    className="w-full text-left px-4 py-3 hover:bg-fm-neutral-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {/* Status dot */}
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full mt-1.5 shrink-0',
                          getStatusDotColor(item.status)
                        )}
                      />

                      <div className="flex-1 min-w-0">
                        {/* Row 1: title + badges */}
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

                        {/* Row 2: meta info */}
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

                        {/* Row 3: description */}
                        {item.description && (
                          <p className="text-sm text-fm-neutral-500 mt-1 line-clamp-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
