/**
 * Badge Component - Design System
 * Consistent badge styling across all sections
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps {
  variant?: 'standard' | 'dark' | 'outline' | 'solid' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  glow?: boolean;
  className?: string;
}

const BadgeVariants = {
  standard: 'inline-flex items-center bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200 rounded-full text-fm-magenta-700 font-medium',
  dark: 'inline-flex items-center bg-fm-magenta-400/20 backdrop-blur-sm border border-fm-magenta-400/40 rounded-full text-fm-magenta-200 font-semibold',
  outline: 'inline-flex items-center bg-transparent backdrop-blur-sm border-2 border-fm-magenta-700 rounded-full text-fm-magenta-700 font-medium',
  solid: 'inline-flex items-center bg-fm-magenta-700 rounded-full text-white font-semibold',
  primary: 'inline-flex items-center bg-fm-magenta-700 rounded-full text-white font-semibold',
} as const;

const BadgeSizes = {
  sm: 'px-3 py-1 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
} as const;

export function Badge({
  variant = 'standard',
  size = 'md',
  children,
  icon,
  glow = false,
  className,
}: BadgeProps) {
  const baseClasses = BadgeVariants[variant];
  const sizeClasses = BadgeSizes[size];
  const glowClasses = glow ? 'badge-glow' : '';

  const badgeClasses = cn(
    baseClasses,
    sizeClasses,
    glowClasses,
    className
  );

  return (
    <div className={badgeClasses}>
      {icon && (
        <span className="flex-shrink-0 w-4 h-4 mr-2">
          {icon}
        </span>
      )}
      {children}
    </div>
  );
}

export default Badge;