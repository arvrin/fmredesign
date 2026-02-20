/**
 * Portfolio Card Component - Design System
 * Compact portfolio item for grid layouts with results and tags
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { patterns } from '../../../patterns';
import { Button } from '../../primitives/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { cn } from '@/lib/utils';

export interface PortfolioResult {
  metric: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface PortfolioCardProps {
  client: string;
  industry: string;
  title: string;
  description: string;
  results: PortfolioResult[];
  tags: string[];
  duration: string;
  imageSlot?: React.ReactNode;
  ctaText?: string;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-4',
    title: 'text-base font-semibold mb-2',
    description: 'text-sm mb-3',
    result: 'text-sm',
    tag: 'text-xs px-2 py-1',
  },
  md: {
    card: 'p-6',
    title: 'text-lg font-semibold mb-3',
    description: 'text-sm mb-4',
    result: 'text-lg',
    tag: 'text-xs px-2 py-1',
  },
  lg: {
    card: 'p-8',
    title: 'text-xl font-semibold mb-4',
    description: 'text-base mb-6',
    result: 'text-xl',
    tag: 'text-sm px-3 py-1',
  },
} as const;

export function PortfolioCard({
  industry,
  title,
  description,
  results,
  tags,
  duration,
  imageSlot,
  ctaText = "View Details",
  size = 'md',
  theme = 'light',
  className,
}: PortfolioCardProps) {
  const sizeConfig = SizeClasses[size];
  
  const cardClasses = cn(
    patterns.card.base,
    sizeConfig.card,
    patterns.card.hover,
    patterns.animation.hover.lift,
    'overflow-hidden',
    className
  );

  const titleClasses = cn(
    'line-clamp-2',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white',
    sizeConfig.title
  );

  const descriptionClasses = cn(
    'line-clamp-3 leading-relaxed',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white,
    sizeConfig.description
  );

  const defaultImageSlot = (
    <div className="aspect-video bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-200 flex items-center justify-center">
      <div className="w-12 h-12 bg-fm-magenta-600/20 rounded-full flex items-center justify-center">
        <ExternalLink className="w-6 h-6 text-fm-magenta-700" />
      </div>
    </div>
  );

  return (
    <div className={cardClasses}>
      {/* Image Section */}
      <div className="mb-6">
        {imageSlot || defaultImageSlot}
      </div>
      
      {/* Content */}
      <div>
        {/* Meta Information */}
        <div className="flex items-center justify-between mb-3">
          <Badge variant="standard" size="sm">
            {industry}
          </Badge>
          <span className={cn(
            'text-xs',
            theme === 'light' ? 'text-fm-neutral-500' : 'text-fm-neutral-300'
          )}>
            {duration}
          </span>
        </div>
        
        {/* Title */}
        <h3 className={titleClasses}>
          {title}
        </h3>
        
        {/* Description */}
        <p className={descriptionClasses}>
          {description}
        </p>
        
        {/* Results Grid */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {results.map((result, index) => (
            <div key={index} className="text-center">
              <div className={cn(
                'font-bold text-fm-magenta-700',
                sizeConfig.result
              )}>
                {result.value}
              </div>
              <div className={cn(
                'text-xs',
                theme === 'light' ? 'text-fm-neutral-600' : 'text-fm-neutral-300'
              )}>
                {result.metric}
              </div>
            </div>
          ))}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                'rounded',
                sizeConfig.tag,
                theme === 'light' 
                  ? 'bg-fm-neutral-200 text-fm-neutral-700'
                  : 'bg-fm-neutral-700 text-fm-neutral-300'
              )}
            >
              {tag}
            </span>
          ))}
        </div>
        
        {/* CTA Button */}
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full"
          icon={<ExternalLink className="w-4 h-4" />}
          iconPosition="right"
          theme={theme}
        >
          {ctaText}
        </Button>
      </div>
    </div>
  );
}

export default PortfolioCard;