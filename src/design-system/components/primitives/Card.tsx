'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/design-system/tokens';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated' | 'flat' | 'admin' | 'client';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  glow?: boolean;
}

const cardVariants = {
  // Base styles (no backdrop-blur — creates containing block for fixed children)
  base: [
    'rounded-xl transition-all duration-300 relative overflow-hidden',
    'border'
  ].join(' '),

  // Visual variants
  variant: {
    default: [
      'bg-white border-fm-neutral-200 shadow-sm',
      'hover:shadow-md hover:border-fm-neutral-300'
    ].join(' '),

    glass: [
      'v2-paper-sm border-white/20'
    ].join(' '),

    elevated: [
      'bg-white border-fm-neutral-100 shadow-xl',
      'hover:shadow-2xl hover:-translate-y-1'
    ].join(' '),

    flat: [
      'bg-fm-neutral-50 border-fm-neutral-200 shadow-none',
      'hover:bg-white hover:shadow-sm'
    ].join(' '),

    admin: [
      'bg-fm-magenta-50/80 border-fm-magenta-200 shadow-lg',
      'backdrop-blur-sm',
      'hover:bg-fm-magenta-50 hover:shadow-xl',
      'hover:border-fm-magenta-300'
    ].join(' '),

    client: [
      'v2-paper border-fm-magenta-100/30'
    ].join(' ')
  },

  // Padding variants
  padding: {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  },

  // Interactive states
  interactive: {
    hover: 'cursor-pointer hover:scale-[1.02] active:scale-[0.98]',
    glow: 'hover:shadow-[0_0_30px_rgba(168,37,72,0.3)] transition-shadow duration-500'
  }
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  glow = false,
  children,
  ...props
}, ref) => {
  // v2-paper / v2-paper-sm already have their own hover transitions
  const skipInteractive = variant === 'client' || variant === 'glass';

  return (
    <div
      ref={ref}
      className={cn(
        cardVariants.base,
        cardVariants.variant[variant],
        cardVariants.padding[padding],
        hover && !skipInteractive && cardVariants.interactive.hover,
        glow && !skipInteractive && cardVariants.interactive.glow,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

// Compound components for better structure
export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 pb-6', className)}
    {...props}
  >
    {children}
  </div>
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <h3
    ref={ref}
    className={cn('text-xl font-semibold leading-none tracking-tight text-fm-neutral-900', className)}
    {...props}
  >
    {children}
  </h3>
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-fm-neutral-600', className)}
    {...props}
  >
    {children}
  </p>
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('', className)}
    {...props}
  >
    {children}
  </div>
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({
  className,
  children,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center pt-6', className)}
    {...props}
  >
    {children}
  </div>
));
CardFooter.displayName = 'CardFooter';
