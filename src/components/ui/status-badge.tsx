import { cn } from '@/lib/utils';

type StatusVariant = 'active' | 'paused' | 'completed' | 'overdue' | 'draft' | 'cancelled' | 'sent' | 'paid' | 'scheduled' | 'approved' | 'planning' | 'partial';

const variants: Record<StatusVariant, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
  paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  sent: 'bg-sky-50 text-sky-700 border-sky-200',
  scheduled: 'bg-violet-50 text-violet-700 border-violet-200',
  planning: 'bg-amber-50 text-amber-700 border-amber-200',
  paused: 'bg-amber-50 text-amber-700 border-amber-200',
  partial: 'bg-amber-50 text-amber-700 border-amber-200',
  overdue: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
  draft: 'bg-fm-neutral-50 text-fm-neutral-600 border-fm-neutral-200',
};

interface StatusBadgeProps {
  status: StatusVariant | string;
  className?: string;
  children?: React.ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const variant = variants[status as StatusVariant] ?? variants.draft;
  const label = children ?? status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        variant,
        className
      )}
    >
      <span
        className={cn(
          'h-1.5 w-1.5 rounded-full',
          status === 'active' || status === 'paid' || status === 'approved'
            ? 'bg-emerald-500'
            : status === 'overdue'
            ? 'bg-red-500'
            : status === 'paused' || status === 'planning' || status === 'partial'
            ? 'bg-amber-500'
            : status === 'completed'
            ? 'bg-blue-500'
            : status === 'sent'
            ? 'bg-sky-500'
            : status === 'scheduled'
            ? 'bg-violet-500'
            : 'bg-fm-neutral-400'
        )}
      />
      {label}
    </span>
  );
}
