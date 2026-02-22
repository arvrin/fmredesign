'use client';

import { DashboardButton as Button } from '@/design-system';
import { cn } from '@/lib/utils';

interface FilterTab {
  key: string;
  label: string;
  count?: number;
}

interface FilterTabBarProps {
  tabs: FilterTab[];
  active: string;
  onChange: (key: string) => void;
  variant?: 'admin' | 'client';
  className?: string;
}

export function FilterTabBar({
  tabs,
  active,
  onChange,
  variant = 'admin',
  className,
}: FilterTabBarProps) {
  const activeVariant = variant === 'client' ? 'client' : 'primary';

  return (
    <div className={cn('flex items-center gap-2 overflow-x-auto pb-1', className)}>
      {tabs.map((tab) => (
        <Button
          key={tab.key}
          variant={active === tab.key ? activeVariant : 'ghost'}
          size="sm"
          onClick={() => onChange(tab.key)}
        >
          {tab.label}
          {tab.count !== undefined && ` (${tab.count})`}
        </Button>
      ))}
    </div>
  );
}
