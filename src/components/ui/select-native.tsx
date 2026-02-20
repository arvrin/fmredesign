import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, children, ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="text-sm font-medium text-fm-neutral-900">
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              'appearance-none w-full h-12 rounded-md border bg-fm-neutral-50 px-3 py-2 pr-9 text-base',
              'border-fm-neutral-300 text-fm-neutral-900',
              'focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2',
              'disabled:cursor-not-allowed disabled:opacity-60 disabled:saturate-50',
              'transition-all duration-200',
              error ? 'border-red-500 focus:ring-red-500' : 'hover:border-fm-magenta-400',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-fm-neutral-500 pointer-events-none" />
        </div>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export { Select };
export type { SelectProps };
