/**
 * Article Card Component - Design System
 * Blog article preview with metadata, tags, and CTA
 */

import React from 'react';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { patterns } from '../../../patterns';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { cn } from '@/lib/utils';

export interface ArticleCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  author: string;
  image?: string;
  tags?: string[];
  imageSlot?: React.ReactNode;
  ctaText?: string;
  href?: string;
  featured?: boolean;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'vertical' | 'horizontal';
  theme?: 'light' | 'dark';
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-4',
    title: 'text-base font-semibold mb-2',
    excerpt: 'text-sm mb-3',
    meta: 'text-xs',
    tag: 'text-xs px-2 py-1',
  },
  md: {
    card: 'p-6',
    title: 'text-lg font-semibold mb-3',
    excerpt: 'text-sm mb-4',
    meta: 'text-sm',
    tag: 'text-xs px-2 py-1',
  },
  lg: {
    card: 'p-8',
    title: 'text-xl font-semibold mb-4',
    excerpt: 'text-base mb-6',
    meta: 'text-base',
    tag: 'text-sm px-3 py-1',
  },
} as const;

export function ArticleCard({
  title,
  excerpt,
  category,
  readTime,
  date,
  author,
  tags = [],
  imageSlot,
  ctaText = "Read More",
  href = "#",
  featured = false,
  size = 'md',
  layout = 'vertical',
  theme = 'light',
  className,
}: ArticleCardProps) {
  const sizeConfig = SizeClasses[size];
  
  const cardClasses = cn(
    patterns.card.base,
    sizeConfig.card,
    patterns.card.hover,
    patterns.animation.hover.lift,
    'overflow-hidden',
    featured && 'border-fm-magenta-300 shadow-lg',
    className
  );

  const titleClasses = cn(
    'line-clamp-2 hover:text-fm-magenta-700 transition-colors',
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white',
    sizeConfig.title
  );

  const excerptClasses = cn(
    'line-clamp-3 leading-relaxed',
    theme === 'light' ? patterns.typography.body.primary : patterns.typography.body.white,
    sizeConfig.excerpt
  );

  const metaClasses = cn(
    theme === 'light' ? 'text-fm-neutral-500' : 'text-fm-neutral-300',
    sizeConfig.meta
  );

  const defaultImageSlot = (
    <div className="aspect-video bg-gradient-to-br from-fm-magenta-100 to-fm-magenta-200 flex items-center justify-center">
      <div className="w-12 h-12 bg-fm-magenta-600/20 rounded-full flex items-center justify-center">
        <ArrowRight className="w-6 h-6 text-fm-magenta-700" />
      </div>
    </div>
  );

  const isHorizontal = layout === 'horizontal';

  return (
    <article className={cardClasses}>
      {/* Layout Container */}
      <div className={cn(
        isHorizontal && 'grid grid-cols-1 md:grid-cols-2 gap-6 items-center'
      )}>
        {/* Image Section */}
        <div className={cn(!isHorizontal && 'mb-6')}>
          {imageSlot || defaultImageSlot}
        </div>
        
        {/* Content Section */}
        <div>
          {/* Category and Read Time */}
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="standard" size="sm">
              {category}
            </Badge>
            <span className={metaClasses}>{readTime}</span>
          </div>
          
          {/* Title */}
          <h3 className={titleClasses}>
            <a href={href}>{title}</a>
          </h3>
          
          {/* Excerpt */}
          <p className={excerptClasses}>
            {excerpt}
          </p>
          
          {/* Tags */}
          {tags.length > 0 && (
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
                  #{tag}
                </span>
              ))}
            </div>
          )}
          
          {/* Author and Date */}
          <div className={cn(
            'flex items-center justify-between mb-4',
            metaClasses
          )}>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              {author}
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {date}
            </div>
          </div>
          
          {/* CTA Button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
            theme={theme}
          >
            {ctaText}
          </Button>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;