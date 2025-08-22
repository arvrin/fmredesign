/**
 * Process Step Component - Design System
 * Visual process step with numbered badge and description
 */

import React from 'react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface ProcessStepProps {
  step: string;
  title: string;
  description: string;
  isLast?: boolean;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
  className?: string;
}

const SizeClasses = {
  sm: {
    stepBadge: 'w-12 h-12 text-sm',
    title: 'text-base font-semibold mb-2',
    description: 'text-sm',
    connector: 'h-0.5',
  },
  md: {
    stepBadge: 'w-16 h-16 text-lg',
    title: 'text-lg font-semibold mb-4',
    description: 'text-base',
    connector: 'h-0.5',
  },
  lg: {
    stepBadge: 'w-20 h-20 text-xl',
    title: 'text-xl font-semibold mb-6',
    description: 'text-lg',
    connector: 'h-1',
  },
} as const;

export function ProcessStep({
  step,
  title,
  description,
  isLast = false,
  theme = 'light',
  size = 'md',
  layout = 'vertical',
  className,
}: ProcessStepProps) {
  const sizeConfig = SizeClasses[size];
  
  const containerClasses = cn(
    'text-center relative',
    className
  );

  const stepBadgeClasses = cn(
    'bg-fm-magenta-700 text-white rounded-full flex items-center justify-center mx-auto font-bold mb-6',
    sizeConfig.stepBadge
  );

  const titleClasses = cn(
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white',
    sizeConfig.title
  );

  const descriptionClasses = cn(
    'leading-relaxed',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white,
    sizeConfig.description
  );

  const connectorClasses = cn(
    'hidden lg:block absolute top-8 left-1/2 w-full bg-fm-magenta-300',
    sizeConfig.connector
  );

  return (
    <div className={containerClasses}>
      {/* Step Badge with Connector */}
      <div className="relative mb-6">
        <div className={stepBadgeClasses}>
          {step}
        </div>
        
        {/* Connector Line (only show if not last step) */}
        {!isLast && layout === 'horizontal' && (
          <div className={connectorClasses} />
        )}
      </div>
      
      {/* Content */}
      <div>
        <h3 className={titleClasses}>
          {title}
        </h3>
        
        <p className={descriptionClasses}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default ProcessStep;