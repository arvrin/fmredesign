import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumb?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, icon, actions, breadcrumb, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {breadcrumb && <div className="mb-3">{breadcrumb}</div>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0 flex items-center gap-3">
          {icon && (
            <div className="shrink-0 text-fm-magenta-600">{icon}</div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-fm-neutral-900 tracking-tight">{title}</h1>
            {description && (
              <p className="mt-1.5 text-sm text-fm-neutral-500">{description}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3 flex-wrap sm:shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
