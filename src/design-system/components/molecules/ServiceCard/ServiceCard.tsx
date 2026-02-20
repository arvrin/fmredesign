/**
 * Service Card Component - Design System
 * Professional service display with features, results, and CTA
 */

import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { patterns } from '../../../patterns';
import { Button } from '../../primitives/Button';
import { cn } from '@/lib/utils';

export interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  results: string;
  ctaText?: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-6',
    iconContainer: 'w-12 h-12',
    icon: 'w-6 h-6',
    title: 'text-lg font-semibold mb-2',
    description: 'text-sm mb-4',
    feature: 'text-xs',
    results: 'text-xs',
    gap: 'gap-4',
  },
  md: {
    card: 'p-8',
    iconContainer: 'w-16 h-16',
    icon: 'w-8 h-8',
    title: 'text-xl font-semibold mb-3',
    description: 'text-base mb-6',
    feature: 'text-sm',
    results: 'text-sm',
    gap: 'gap-6',
  },
  lg: {
    card: 'p-10',
    iconContainer: 'w-20 h-20',
    icon: 'w-10 h-10',
    title: 'text-2xl font-semibold mb-4',
    description: 'text-lg mb-8',
    feature: 'text-base',
    results: 'text-base',
    gap: 'gap-8',
  },
} as const;

export function ServiceCard({
  icon,
  title,
  description,
  features,
  results,
  ctaText = "Learn More",
  size = 'md',
  layout = 'horizontal',
  className,
}: ServiceCardProps) {
  const sizeConfig = SizeClasses[size];
  const isHorizontal = layout === 'horizontal';
  
  const cardClasses = cn(
    patterns.card.base,
    sizeConfig.card,
    patterns.card.hover,
    patterns.animation.hover.lift,
    'hover:border-fm-magenta-300',
    className
  );

  const iconContainerClasses = cn(
    'bg-fm-magenta-100 rounded-xl flex items-center justify-center',
    sizeConfig.iconContainer,
    isHorizontal ? 'flex-shrink-0' : 'mx-auto mb-6'
  );

  const titleClasses = cn(
    'text-fm-neutral-900',
    sizeConfig.title
  );

  const descriptionClasses = cn(
    'text-fm-neutral-600 leading-relaxed',
    sizeConfig.description
  );

  const featureClasses = cn(
    'text-fm-neutral-700',
    sizeConfig.feature
  );

  const resultsClasses = cn(
    'text-fm-magenta-700 font-medium',
    sizeConfig.results
  );

  return (
    <div className={cardClasses}>
      <div className={cn(
        isHorizontal && sizeConfig.gap,
        isHorizontal && 'flex items-start'
      )}>
        {/* Icon */}
        <div className={iconContainerClasses}>
          <div className="w-8 h-8 text-fm-magenta-700">
            {icon}
          </div>
        </div>
        
        {/* Content */}
        <div className={cn(isHorizontal && 'flex-1')}>
          {/* Title */}
          <h3 className={titleClasses}>
            {title}
          </h3>
          
          {/* Description */}
          <p className={descriptionClasses}>
            {description}
          </p>
          
          {/* Features List */}
          <div className="space-y-3 mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-fm-magenta-700 flex-shrink-0" />
                <span className={featureClasses}>{feature}</span>
              </div>
            ))}
          </div>
          
          {/* Results Highlight */}
          <div className="bg-fm-magenta-50 rounded-lg p-4 mb-6">
            <p className={resultsClasses}>
              <strong>Results:</strong> {results}
            </p>
          </div>
          
          {/* CTA Button */}
          <Button 
            variant="secondary" 
            size={size === 'lg' ? 'md' : 'sm'}
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ServiceCard;