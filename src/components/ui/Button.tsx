import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'ghost-light' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, asChild = false, ...props }, ref) => {
    const baseStyles = [
      'inline-flex items-center justify-center rounded-md font-semibold transition-all duration-200',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fm-magenta-700 focus-visible:ring-offset-2',
      'disabled:opacity-50 disabled:pointer-events-none',
      'transform hover:-translate-y-0.5 active:translate-y-0',
    ];

    const variants = {
      primary: [
        'bg-fm-magenta-700 text-fm-neutral-50 shadow-fm-sm',
        'hover:bg-fm-magenta-800 hover:shadow-fm-md',
      ],
      secondary: [
        'bg-transparent text-fm-magenta-700 border-2 border-fm-magenta-700',
        'hover:bg-fm-magenta-700 hover:text-fm-neutral-50',
      ],
      accent: [
        'bg-fm-orange-600 text-fm-neutral-50 shadow-fm-sm',
        'hover:bg-fm-orange-500 hover:shadow-fm-md',
      ],
      ghost: [
        'bg-transparent text-fm-magenta-700',
        'hover:bg-fm-magenta-50 hover:text-fm-magenta-800',
      ],
      'ghost-light': [
        'bg-transparent text-fm-neutral-50 border border-fm-neutral-50',
        'hover:bg-fm-neutral-50 hover:text-fm-magenta-700 hover:border-fm-neutral-50',
      ],
      outline: [
        'bg-transparent text-fm-neutral-700 border border-fm-neutral-300',
        'hover:bg-fm-neutral-50 hover:border-fm-magenta-700 hover:text-fm-magenta-700',
      ],
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-12 px-6 text-base',
      lg: 'h-14 px-8 text-lg',
    };

    const classes = cn(
      baseStyles,
      variants[variant],
      sizes[size],
      className
    );

    if (asChild) {
      return (
        <span className={classes} {...props}>
          {children}
        </span>
      );
    }

    return (
      <button className={classes} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
export type { ButtonProps };