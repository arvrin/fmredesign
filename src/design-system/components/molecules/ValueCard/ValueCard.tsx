/**
 * Value Card Component - Design System
 * Specialized card for company values, team features, etc.
 */

import React from 'react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  hover?: boolean;
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-6',
    icon: 'w-12 h-12 mb-4',
    title: 'text-lg font-bold mb-3',
    description: 'text-sm',
  },
  md: {
    card: 'p-8',
    icon: 'w-16 h-16 mb-6',
    title: 'text-xl font-bold mb-4',
    description: 'text-base',
  },
  lg: {
    card: 'p-10',
    icon: 'w-20 h-20 mb-8',
    title: 'text-2xl font-bold mb-6',
    description: 'text-lg',
  },
} as const;

export function ValueCard({
  icon,
  title,
  description,
  theme = 'light',
  size = 'md',
  hover = true,
  className,
}: ValueCardProps) {
  const sizeConfig = SizeClasses[size];
  
  const cardClasses = cn(
    patterns.card.base,
    sizeConfig.card,
    hover && patterns.card.hover,
    hover && patterns.animation.hover.scale,
    className
  );

  const iconClasses = cn(
    'flex items-center justify-center rounded-2xl mx-auto',
    'bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-50',
    'text-fm-magenta-700',
    sizeConfig.icon
  );

  const titleClasses = cn(
    'text-center',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white',
    sizeConfig.title
  );

  const descriptionClasses = cn(
    'text-center leading-relaxed',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white,
    sizeConfig.description
  );

  return (
    <div className={cardClasses}>
      <div className={iconClasses}>
        {icon}
      </div>
      
      <h3 className={titleClasses}>
        {title}
      </h3>
      
      <p className={descriptionClasses}>
        {description}
      </p>
    </div>
  );
}

export default ValueCard;