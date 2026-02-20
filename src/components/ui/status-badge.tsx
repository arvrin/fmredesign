import { cn } from '@/lib/utils';

/**
 * Canonical status color mapping for all admin entities.
 * Every status across projects, content, invoices, proposals, leads, support, discovery, and team uses this.
 */
const variants: Record<string, string> = {
  // Green family — positive/complete states
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  resolved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  converted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',

  // Blue family — completed/done states
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  closed: 'bg-blue-50 text-blue-700 border-blue-200',

  // Sky family — sent/in-transit states
  sent: 'bg-sky-50 text-sky-700 border-sky-200',
  open: 'bg-sky-50 text-sky-700 border-sky-200',
  new: 'bg-sky-50 text-sky-700 border-sky-200',
  contacted: 'bg-sky-50 text-sky-700 border-sky-200',
  submitted: 'bg-sky-50 text-sky-700 border-sky-200',
  viewed: 'bg-sky-50 text-sky-700 border-sky-200',

  // Violet family — scheduled/future states
  scheduled: 'bg-violet-50 text-violet-700 border-violet-200',
  'in-progress': 'bg-violet-50 text-violet-700 border-violet-200',
  in_progress: 'bg-violet-50 text-violet-700 border-violet-200',

  // Amber family — warning/pending states
  planning: 'bg-amber-50 text-amber-700 border-amber-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  review: 'bg-amber-50 text-amber-700 border-amber-200',
  under_review: 'bg-amber-50 text-amber-700 border-amber-200',
  qualified: 'bg-amber-50 text-amber-700 border-amber-200',
  warm: 'bg-amber-50 text-amber-700 border-amber-200',
  on_hold: 'bg-amber-50 text-amber-700 border-amber-200',
  'on-hold': 'bg-amber-50 text-amber-700 border-amber-200',

  // Red family — urgent/negative states
  overdue: 'bg-red-50 text-red-700 border-red-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
  hot: 'bg-red-50 text-red-700 border-red-200',
  high: 'bg-red-50 text-red-700 border-red-200',

  // Neutral family — inactive/draft states
  cancelled: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  draft: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  inactive: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  rejected: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  declined: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  lost: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  cold: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  expired: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  low: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  medium: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
};

// Dot color mapping (derived from the variant family)
const dotColors: Record<string, string> = {
  // Green family
  active: 'bg-emerald-500', paid: 'bg-emerald-500', approved: 'bg-emerald-500',
  resolved: 'bg-emerald-500', converted: 'bg-emerald-500', accepted: 'bg-emerald-500',
  published: 'bg-emerald-500',
  // Blue family
  completed: 'bg-blue-500', closed: 'bg-blue-500',
  // Sky family
  sent: 'bg-sky-500', open: 'bg-sky-500', new: 'bg-sky-500', contacted: 'bg-sky-500',
  submitted: 'bg-sky-500', viewed: 'bg-sky-500',
  // Violet family
  scheduled: 'bg-violet-500', 'in-progress': 'bg-violet-500', in_progress: 'bg-violet-500',
  // Amber family
  planning: 'bg-amber-500', paused: 'bg-amber-500', partial: 'bg-amber-500',
  pending: 'bg-amber-500', review: 'bg-amber-500', under_review: 'bg-amber-500', qualified: 'bg-amber-500',
  warm: 'bg-amber-500', on_hold: 'bg-amber-500', 'on-hold': 'bg-amber-500',
  // Red family
  overdue: 'bg-red-500', urgent: 'bg-red-500', hot: 'bg-red-500', high: 'bg-red-500',
};

interface StatusBadgeProps {
  status: string;
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const normalized = status.toLowerCase().trim();
  const variant = variants[normalized] ?? variants.draft;
  const dot = dotColors[normalized] ?? 'bg-fm-neutral-400';
  const label = children ?? status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variant,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot)} />
      {label}
    </span>
  );
}
