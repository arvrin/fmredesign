import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-8 px-4 md:py-16', className)}>
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-fm-magenta-50 flex items-center justify-center mb-5 text-fm-magenta-600">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-fm-neutral-900 mb-2">{title}</h3>
      {description && (
        <p className="text-sm text-fm-neutral-500 mb-6 max-w-sm" style={{ textAlign: 'center' }}>
          {description}
        </p>
      )}
      {action}
    </div>
  );
}
