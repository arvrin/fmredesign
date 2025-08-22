/**
 * Stat Card Component - Design System
 * Display statistics and metrics with visual impact
 */

import React from 'react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface StatCardProps {
  number: string;
  label: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient' | 'minimal';
  icon?: React.ReactNode;
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-6',
    number: 'text-3xl font-bold mb-2',
    label: 'text-sm',
  },
  md: {
    card: 'p-8',
    number: 'text-4xl md:text-5xl font-bold mb-3',
    label: 'text-base',
  },
  lg: {
    card: 'p-10',
    number: 'text-5xl md:text-6xl font-bold mb-4',
    label: 'text-lg',
  },
} as const;

const VariantClasses = {
  default: {
    card: 'bg-white border border-fm-neutral-200 rounded-2xl shadow-lg',
    number: 'text-fm-magenta-700',
    label: 'text-fm-neutral-600',
  },
  gradient: {
    card: 'bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 rounded-2xl shadow-xl',
    number: 'text-white',
    label: 'text-fm-magenta-100',
  },
  minimal: {
    card: 'bg-transparent',
    number: 'text-fm-magenta-700',
    label: 'text-fm-neutral-600',
  },
} as const;

export function StatCard({
  number,
  label,
  size = 'md',
  variant = 'default',
  icon,
  className,
}: StatCardProps) {
  const sizeConfig = SizeClasses[size];
  const variantConfig = VariantClasses[variant];
  
  const cardClasses = cn(
    'text-center transition-all duration-300',
    variantConfig.card,
    sizeConfig.card,
    variant !== 'minimal' && patterns.card.hover,
    variant !== 'minimal' && patterns.animation.hover.scale,
    className
  );

  const numberClasses = cn(
    'font-display leading-none',
    variantConfig.number,
    sizeConfig.number
  );

  const labelClasses = cn(
    'font-medium leading-relaxed',
    variantConfig.label,
    sizeConfig.label
  );

  return (
    <div className={cardClasses}>
      {icon && (
        <div className="flex justify-center mb-4">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center',
            variant === 'gradient' 
              ? 'bg-white/20 text-white' 
              : 'bg-fm-magenta-100 text-fm-magenta-700'
          )}>
            {icon}
          </div>
        </div>
      )}
      
      <div className={numberClasses}>
        {number}
      </div>
      
      <div className={labelClasses}>
        {label}
      </div>
    </div>
  );
}

export default StatCard;