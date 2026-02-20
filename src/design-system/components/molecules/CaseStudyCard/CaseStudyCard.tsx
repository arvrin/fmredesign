/**
 * Case Study Card Component - Design System
 * Featured case study display with detailed metrics and results
 */

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { patterns } from '../../../patterns';
import { Button } from '../../primitives/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { cn } from '@/lib/utils';

export interface CaseStudyResult {
  metric: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface CaseStudyCardProps {
  client: string;
  industry: string;
  title: string;
  description: string;
  results: CaseStudyResult[];
  tags: string[];
  duration: string;
  imageSlot?: React.ReactNode;
  featured?: boolean;
  reversed?: boolean;
  ctaText?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export function CaseStudyCard({
  industry,
  title,
  description,
  results,
  tags,
  duration,
  imageSlot,
  reversed = false,
  ctaText = "Read Full Case Study",
  theme = 'light',
  className,
}: CaseStudyCardProps) {
  const containerClasses = cn(
    'grid lg:grid-cols-2 gap-12 items-center',
    className
  );

  const contentClasses = cn(
    reversed && 'lg:order-1'
  );

  const imageClasses = cn(
    reversed && 'lg:order-2'
  );

  const titleClasses = cn(
    'text-2xl md:text-3xl font-bold mb-4',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white'
  );

  const descriptionClasses = cn(
    'mb-8 leading-relaxed',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white
  );

  const defaultImageSlot = (
    <div className="aspect-video bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-200 rounded-xl flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-fm-magenta-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <ExternalLink className="w-8 h-8 text-fm-magenta-700" />
        </div>
        <p className="text-fm-magenta-700 font-semibold">Case Study Visual</p>
      </div>
    </div>
  );

  return (
    <div className={containerClasses}>
      {/* Image Section */}
      <div className={imageClasses}>
        {imageSlot || defaultImageSlot}
      </div>
      
      {/* Content Section */}
      <div className={contentClasses}>
        {/* Meta Information */}
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="standard" size="sm">
            {industry}
          </Badge>
          <span className={cn(
            'text-sm',
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
        <div className="grid grid-cols-3 gap-6 mb-8">
          {results.map((result, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-fm-magenta-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <result.icon className="w-6 h-6 text-fm-magenta-700" />
              </div>
              <div className="text-2xl font-bold text-fm-magenta-700 mb-1">
                {result.value}
              </div>
              <div className={cn(
                'text-sm',
                theme === 'light' ? 'text-fm-neutral-600' : 'text-fm-neutral-300'
              )}>
                {result.metric}
              </div>
            </div>
          ))}
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={cn(
                'text-xs px-3 py-1 rounded-full',
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

export default CaseStudyCard;