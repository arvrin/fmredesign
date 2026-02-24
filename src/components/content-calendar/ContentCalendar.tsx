'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  getWeekStart,
  getMonthDateRange,
  getWeekDateRange,
  groupItemsByDate,
  isSameDay,
} from './calendar-utils';
import { CalendarHeader } from './CalendarHeader';
import { MonthGrid } from './MonthGrid';
import { WeekView } from './WeekView';
import { DayDetailPanel } from './DayDetailPanel';
import type { CalendarViewMode, ContentCalendarProps } from './types';

export function ContentCalendar({
  items,
  loading = false,
  variant,
  onDateRangeChange,
  onItemClick,
  getClientName,
}: ContentCalendarProps) {
  const now = new Date();

  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(now));
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Fire date range callback whenever navigation changes
  const emitRange = useCallback(() => {
    if (viewMode === 'month') {
      const range = getMonthDateRange(currentYear, currentMonth);
      onDateRangeChange(range.start, range.end);
    } else {
      const range = getWeekDateRange(currentWeekStart);
      onDateRangeChange(range.start, range.end);
    }
  }, [viewMode, currentYear, currentMonth, currentWeekStart, onDateRangeChange]);

  useEffect(() => {
    emitRange();
  }, [emitRange]);

  // Navigation handlers
  const goToday = () => {
    const today = new Date();
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
    setCurrentWeekStart(getWeekStart(today));
    setSelectedDate(null);
  };

  const goPrev = () => {
    if (viewMode === 'month') {
      const prev = new Date(currentYear, currentMonth - 1, 1);
      setCurrentYear(prev.getFullYear());
      setCurrentMonth(prev.getMonth());
    } else {
      const prev = new Date(currentWeekStart);
      prev.setDate(prev.getDate() - 7);
      setCurrentWeekStart(prev);
    }
    setSelectedDate(null);
  };

  const goNext = () => {
    if (viewMode === 'month') {
      const next = new Date(currentYear, currentMonth + 1, 1);
      setCurrentYear(next.getFullYear());
      setCurrentMonth(next.getMonth());
    } else {
      const next = new Date(currentWeekStart);
      next.setDate(next.getDate() + 7);
      setCurrentWeekStart(next);
    }
    setSelectedDate(null);
  };

  const handleViewModeChange = (mode: CalendarViewMode) => {
    if (mode === viewMode) return;

    if (mode === 'week') {
      // Switch to week: use selected date or current date to pick the week
      const target = selectedDate || new Date(currentYear, currentMonth, 15);
      setCurrentWeekStart(getWeekStart(target));
    } else {
      // Switch to month: show the month containing the current week
      setCurrentYear(currentWeekStart.getFullYear());
      setCurrentMonth(currentWeekStart.getMonth());
    }
    setSelectedDate(null);
    setViewMode(mode);
  };

  const handleSelectDate = (date: Date) => {
    if (selectedDate && isSameDay(date, selectedDate)) {
      setSelectedDate(null); // toggle off
    } else {
      setSelectedDate(date);
    }
  };

  // Items for the selected day (day detail panel)
  const selectedDayItems = useMemo(() => {
    if (!selectedDate) return [];
    const grouped = groupItemsByDate(items);
    const key = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;
    return grouped.get(key) || [];
  }, [selectedDate, items]);

  // Count unscheduled items
  const unscheduledCount = useMemo(
    () => items.filter((i) => !i.scheduledDate).length,
    [items]
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-9 w-32" />
        </div>
        <Skeleton className="h-[500px] rounded-xl" />
      </div>
    );
  }

  return (
    <div>
      <CalendarHeader
        viewMode={viewMode}
        currentYear={currentYear}
        currentMonth={currentMonth}
        currentWeekStart={currentWeekStart}
        onPrev={goPrev}
        onNext={goNext}
        onToday={goToday}
        onViewModeChange={handleViewModeChange}
        variant={variant}
      />

      {/* Unscheduled banner */}
      {unscheduledCount > 0 && (
        <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            {unscheduledCount} item{unscheduledCount !== 1 ? 's have' : ' has'} no scheduled date
          </span>
        </div>
      )}

      {/* Views */}
      {viewMode === 'month' ? (
        <>
          <div className="rounded-xl border border-fm-neutral-200 overflow-hidden bg-white">
            <MonthGrid
              year={currentYear}
              month={currentMonth}
              items={items}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              onItemClick={onItemClick}
            />
          </div>

          {/* Day detail panel */}
          {selectedDate && (
            <DayDetailPanel
              date={selectedDate}
              items={selectedDayItems}
              variant={variant}
              onClose={() => setSelectedDate(null)}
              onItemClick={onItemClick}
              getClientName={getClientName}
            />
          )}
        </>
      ) : (
        <WeekView
          weekStart={currentWeekStart}
          items={items}
          variant={variant}
          onItemClick={onItemClick}
          getClientName={getClientName}
        />
      )}
    </div>
  );
}
