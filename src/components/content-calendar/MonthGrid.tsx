'use client';

import { cn } from '@/lib/utils';
import {
  getMonthGrid,
  isSameDay,
  isToday,
  groupItemsByDate,
  getStatusDotColor,
  PLATFORM_ABBREV,
} from './calendar-utils';
import type { CalendarContentItem } from './types';

interface MonthGridProps {
  year: number;
  month: number;
  items: CalendarContentItem[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onItemClick?: (itemId: string) => void;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function MonthGrid({
  year,
  month,
  items,
  selectedDate,
  onSelectDate,
  onItemClick,
}: MonthGridProps) {
  const grid = getMonthGrid(year, month);
  const grouped = groupItemsByDate(items);

  return (
    <div>
      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-fm-neutral-200">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="py-2 text-center text-xs font-medium text-fm-neutral-500 uppercase tracking-wider"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Grid of days */}
      <div className="grid grid-cols-7 border-l border-fm-neutral-200">
        {grid.flat().map((date, idx) => {
          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
          const dayItems = grouped.get(key) || [];
          const isCurrentMonth = date.getMonth() === month;
          const today = isToday(date);
          const isSelected = selectedDate ? isSameDay(date, selectedDate) : false;

          return (
            <button
              key={idx}
              onClick={() => onSelectDate(date)}
              className={cn(
                'relative border-r border-b border-fm-neutral-200 text-left transition-colors',
                // Desktop: tall cells; Mobile: square compact
                'min-h-[44px] md:min-h-[120px] p-1 md:p-2',
                isCurrentMonth
                  ? 'bg-white hover:bg-fm-neutral-50'
                  : 'bg-fm-neutral-50/50 hover:bg-fm-neutral-100/50',
                isSelected && 'ring-2 ring-inset ring-fm-magenta-500'
              )}
            >
              {/* Day number */}
              <span
                className={cn(
                  'inline-flex items-center justify-center text-sm font-medium rounded-full w-7 h-7',
                  today && 'bg-fm-magenta-600 text-white',
                  !today && isCurrentMonth && 'text-fm-neutral-900',
                  !today && !isCurrentMonth && 'text-fm-neutral-400'
                )}
              >
                {date.getDate()}
              </span>

              {/* Desktop: content chips (hidden on mobile) */}
              <div className="hidden md:flex flex-col gap-0.5 mt-1">
                {dayItems.slice(0, 3).map((item) => (
                  <button
                    key={item.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onItemClick?.(item.id);
                    }}
                    className="flex items-center gap-1 rounded px-1 py-0.5 text-xs text-fm-neutral-700 hover:bg-fm-neutral-100 truncate w-full text-left"
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 rounded-full shrink-0',
                        getStatusDotColor(item.status)
                      )}
                    />
                    <span className="text-fm-neutral-500 shrink-0">
                      {PLATFORM_ABBREV[item.platform.toLowerCase()] || item.platform}
                    </span>
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
                {dayItems.length > 3 && (
                  <span className="text-xs text-fm-neutral-500 pl-1">
                    +{dayItems.length - 3} more
                  </span>
                )}
              </div>

              {/* Mobile: colored dots only */}
              {dayItems.length > 0 && (
                <div className="flex md:hidden gap-0.5 mt-1 flex-wrap justify-center">
                  {dayItems.slice(0, 4).map((item) => (
                    <span
                      key={item.id}
                      className={cn(
                        'h-1.5 w-1.5 rounded-full',
                        getStatusDotColor(item.status)
                      )}
                    />
                  ))}
                  {dayItems.length > 4 && (
                    <span className="text-[10px] text-fm-neutral-400 leading-none">
                      +{dayItems.length - 4}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
