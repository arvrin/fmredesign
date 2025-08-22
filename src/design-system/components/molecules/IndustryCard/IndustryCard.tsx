/**
 * Industry Card Component - Design System
 * Industry statistics display with count and hover effects
 */

import React from 'react';
import { cn } from '@/lib/utils';

export interface IndustryCardProps {
  name: string;
  count: string;
  icon?: React.ReactNode;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-4',
    count: 'text-lg font-bold mb-1',
    name: 'text-sm font-medium',
    icon: 'w-6 h-6 mb-2',
  },
  md: {
    card: 'p-6',
    count: 'text-2xl font-bold mb-2',
    name: 'text-base font-medium',
    icon: 'w-8 h-8 mb-3',
  },
  lg: {
    card: 'p-8',
    count: 'text-3xl font-bold mb-3',
    name: 'text-lg font-medium',
    icon: 'w-10 h-10 mb-4',
  },
} as const;

export function IndustryCard({
  name,
  count,
  icon,
  theme = 'light',
  size = 'md',
  hover = true,
  className,
}: IndustryCardProps) {
  const sizeConfig = SizeClasses[size];
  
  const cardClasses = cn(
    'text-center border rounded-lg transition-colors',
    sizeConfig.card,
    theme === 'light' 
      ? 'bg-fm-neutral-50 border-fm-neutral-200 hover:border-fm-magenta-300'
      : 'bg-fm-neutral-800 border-fm-neutral-700 hover:border-fm-magenta-500',
    hover && 'cursor-pointer',
    className
  );

  const countClasses = cn(
    'text-fm-magenta-700',
    sizeConfig.count
  );

  const nameClasses = cn(
    theme === 'light' ? 'text-fm-neutral-700' : 'text-fm-neutral-200',
    sizeConfig.name
  );

  const iconClasses = cn(
    'mx-auto text-fm-magenta-600',
    sizeConfig.icon
  );

  return (
    <div className={cardClasses}>
      {/* Icon */}
      {icon && (
        <div className={iconClasses}>
          {icon}
        </div>
      )}
      
      {/* Count */}
      <div className={countClasses}>
        {count}
      </div>
      
      {/* Name */}
      <div className={nameClasses}>
        {name}
      </div>
    </div>
  );
}

export default IndustryCard;