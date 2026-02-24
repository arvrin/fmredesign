'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardButton } from '@/design-system';
import { formatMonthYear, formatWeekRange } from './calendar-utils';
import type { CalendarViewMode } from './types';

interface CalendarHeaderProps {
  viewMode: CalendarViewMode;
  currentYear: number;
  currentMonth: number;
  currentWeekStart: Date;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onViewModeChange: (mode: CalendarViewMode) => void;
  variant: 'admin' | 'client';
}

export function CalendarHeader({
  viewMode,
  currentYear,
  currentMonth,
  currentWeekStart,
  onPrev,
  onNext,
  onToday,
  onViewModeChange,
  variant,
}: CalendarHeaderProps) {
  const title =
    viewMode === 'month'
      ? formatMonthYear(currentYear, currentMonth)
      : formatWeekRange(currentWeekStart);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
      {/* Nav: prev / today / next */}
      <div className="flex items-center gap-1.5">
        <DashboardButton variant="ghost" size="sm" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </DashboardButton>
        <DashboardButton variant="ghost" size="sm" onClick={onToday}>
          Today
        </DashboardButton>
        <DashboardButton variant="ghost" size="sm" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </DashboardButton>

        {/* Title */}
        <h2 className="text-lg font-semibold text-fm-neutral-900 ml-2">
          {title}
        </h2>
      </div>

      {/* Month / Week toggle */}
      <div className="flex items-center rounded-lg border border-fm-neutral-200 overflow-hidden shrink-0">
        <button
          onClick={() => onViewModeChange('month')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
            viewMode === 'month'
              ? 'bg-fm-magenta-600 text-white'
              : 'bg-white text-fm-neutral-600 hover:bg-fm-neutral-50'
          }`}
        >
          Month
        </button>
        <button
          onClick={() => onViewModeChange('week')}
          className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors ${
            viewMode === 'week'
              ? 'bg-fm-magenta-600 text-white'
              : 'bg-white text-fm-neutral-600 hover:bg-fm-neutral-50'
          }`}
        >
          Week
        </button>
      </div>
    </div>
  );
}
