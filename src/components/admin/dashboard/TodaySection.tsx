'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface TodaySectionProps {
  title: string;
  count?: number;
  variant?: 'default' | 'danger' | 'warning';
  viewAllHref?: string;
  children: React.ReactNode;
}

const borderColors = {
  default: 'border-l-fm-magenta-400',
  danger: 'border-l-red-500',
  warning: 'border-l-amber-500',
};

const headerColors = {
  default: 'text-fm-neutral-900',
  danger: 'text-red-700',
  warning: 'text-amber-700',
};

const badgeColors = {
  default: 'bg-fm-magenta-100 text-fm-magenta-700',
  danger: 'bg-red-100 text-red-700',
  warning: 'bg-amber-100 text-amber-700',
};

export function TodaySection({ title, count, variant = 'default', viewAllHref, children }: TodaySectionProps) {
  return (
    <section className={cn('rounded-xl border border-fm-neutral-200 border-l-4 bg-white overflow-hidden', borderColors[variant])}>
      <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-fm-neutral-100">
        <div className="flex items-center gap-2">
          <h2 className={cn('text-sm font-semibold', headerColors[variant])}>{title}</h2>
          {count !== undefined && count > 0 && (
            <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded-full', badgeColors[variant])}>
              {count}
            </span>
          )}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-medium text-fm-magenta-700 hover:text-fm-magenta-800 flex items-center gap-1"
          >
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
