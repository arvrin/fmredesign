'use client';

import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BulkAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger';
  icon?: React.ReactNode;
}

interface BulkActionBarProps {
  count: number;
  actions: BulkAction[];
  onDeselectAll: () => void;
}

export function BulkActionBar({ count, actions, onDeselectAll }: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div
      className="fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-fm-neutral-900 text-white rounded-xl shadow-2xl px-4 py-3 animate-in slide-in-from-bottom-4 duration-200"
      style={{ zIndex: 38 }}
    >
      <span className="text-sm font-medium whitespace-nowrap">
        {count} selected
      </span>

      <div className="w-px h-5 bg-fm-neutral-700" />

      <div className="flex items-center gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={action.onClick}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors',
              action.variant === 'danger'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-white/10 hover:bg-white/20 text-white'
            )}
          >
            {action.icon}
            {action.label}
          </button>
        ))}
      </div>

      <button
        onClick={onDeselectAll}
        className="p-1.5 rounded-lg hover:bg-white/10 transition-colors ml-1"
        aria-label="Deselect all"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
