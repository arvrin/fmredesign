import type { CalendarContentItem } from './types';

/**
 * Get the Monday-start week that contains the given date.
 */
export function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun, 1=Mon, ...
  const diff = day === 0 ? -6 : 1 - day; // shift to Monday
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Get 7 consecutive days starting from the given Monday.
 */
export function getWeekDays(monday: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(d.getDate() + i);
    return d;
  });
}

/**
 * Build a 2D grid of dates for a month view (Monday-start, 6 rows x 7 cols).
 * Pads with days from adjacent months to fill the grid.
 */
export function getMonthGrid(year: number, month: number): Date[][] {
  // First day of the month
  const first = new Date(year, month, 1);
  // Start grid from the Monday on or before the first day
  const gridStart = getWeekStart(first);

  const weeks: Date[][] = [];
  const cursor = new Date(gridStart);

  for (let w = 0; w < 6; w++) {
    const week: Date[] = [];
    for (let d = 0; d < 7; d++) {
      week.push(new Date(cursor));
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  // Trim trailing week if it's entirely in the next month
  const lastWeek = weeks[weeks.length - 1];
  if (lastWeek[0].getMonth() !== month && lastWeek[6].getMonth() !== month) {
    weeks.pop();
  }

  return weeks;
}

/**
 * ISO date range covering the full visible month grid (including padding days).
 */
export function getMonthDateRange(year: number, month: number): { start: string; end: string } {
  const grid = getMonthGrid(year, month);
  const first = grid[0][0];
  const last = grid[grid.length - 1][6];
  return {
    start: toISODate(first),
    end: toISODate(last),
  };
}

/**
 * ISO date range for a week starting on the given date.
 */
export function getWeekDateRange(monday: Date): { start: string; end: string } {
  const days = getWeekDays(monday);
  return {
    start: toISODate(days[0]),
    end: toISODate(days[6]),
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

export function formatWeekRange(monday: Date): string {
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const startStr = monday.toLocaleDateString('en-US', opts);
  const endStr = sunday.toLocaleDateString('en-US', {
    ...opts,
    year: 'numeric',
  });

  return `${startStr} \u2013 ${endStr}`;
}

/**
 * Group items by their scheduled date (YYYY-MM-DD key).
 */
export function groupItemsByDate(
  items: CalendarContentItem[]
): Map<string, CalendarContentItem[]> {
  const map = new Map<string, CalendarContentItem[]>();
  for (const item of items) {
    if (!item.scheduledDate) continue;
    const key = item.scheduledDate.slice(0, 10); // YYYY-MM-DD
    const arr = map.get(key) || [];
    arr.push(item);
    map.set(key, arr);
  }
  return map;
}

/** Format Date to YYYY-MM-DD */
function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Platform abbreviation map */
export const PLATFORM_ABBREV: Record<string, string> = {
  instagram: 'IG',
  facebook: 'FB',
  linkedin: 'LI',
  twitter: 'TW',
  youtube: 'YT',
  tiktok: 'TT',
  website: 'Web',
  email: 'Email',
};

/** Status dot colors (matches status-badge.tsx dotColors) */
export const STATUS_DOT_COLORS: Record<string, string> = {
  draft: 'bg-fm-neutral-400',
  review: 'bg-amber-500',
  approved: 'bg-emerald-500',
  scheduled: 'bg-violet-500',
  published: 'bg-emerald-500',
  revision_needed: 'bg-red-500',
};

export function getStatusDotColor(status: string): string {
  return STATUS_DOT_COLORS[status] || 'bg-fm-neutral-400';
}
