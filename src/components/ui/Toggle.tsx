import React from 'react';
import { cn } from '@/lib/utils';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  description?: string;
  className?: string;
}

const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  ({ 
    checked,
    onChange,
    disabled = false,
    size = 'md',
    label,
    description,
    className 
  }, ref) => {
    const sizeClasses = {
      sm: 'w-8 h-5',
      md: 'w-11 h-6', 
      lg: 'w-14 h-7'
    };

    const thumbSizeClasses = {
      sm: 'after:h-4 after:w-4',
      md: 'after:h-5 after:w-5',
      lg: 'after:h-6 after:w-6'
    };

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            ref={ref}
            type="checkbox"
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            disabled={disabled}
            className="sr-only peer"
          />
          <div className={cn(
            "bg-fm-neutral-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-fm-magenta-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-fm-neutral-300 after:border after:rounded-full after:transition-all peer-checked:bg-fm-magenta-700",
            sizeClasses[size],
            thumbSizeClasses[size],
            disabled && 'opacity-50 cursor-not-allowed'
          )}></div>
        </label>
        
        {(label || description) && (
          <div className="flex-1">
            {label && (
              <p className="font-medium text-fm-neutral-900">{label}</p>
            )}
            {description && (
              <p className="text-sm text-fm-neutral-600 mt-1">{description}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Toggle.displayName = 'Toggle';

export { Toggle };
export type { ToggleProps };