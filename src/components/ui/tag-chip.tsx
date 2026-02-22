import { cn } from '@/lib/utils';

interface TagChipProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'magenta';
  className?: string;
}

export function TagChip({ children, variant = 'neutral', className }: TagChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-1 text-xs rounded-full',
        variant === 'magenta'
          ? 'bg-fm-magenta-100 text-fm-magenta-700'
          : 'bg-fm-neutral-100 text-fm-neutral-700',
        className
      )}
    >
      {children}
    </span>
  );
}
