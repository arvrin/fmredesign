/**
 * Featured Article Component - Design System
 * Hero-style featured article with gradient background and prominent layout
 */

import React from 'react';
import { ArrowRight, Calendar, Clock, User } from 'lucide-react';
import { Button } from '../../atoms/Button/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { cn } from '@/lib/utils';

export interface FeaturedArticleProps {
  title: string;
  excerpt: string;
  category?: string;
  readTime: string;
  date: string;
  author: string;
  imageSlot?: React.ReactNode;
  ctaText?: string;
  href?: string;
  layout?: 'horizontal' | 'vertical';
  size?: 'md' | 'lg' | 'xl';
  className?: string;
}

const SizeClasses = {
  md: {
    container: 'p-8',
    title: 'text-2xl font-bold leading-tight',
    excerpt: 'text-base leading-relaxed',
    meta: 'text-sm',
  },
  lg: {
    container: 'p-12',
    title: 'text-3xl font-bold leading-tight',
    excerpt: 'text-lg leading-relaxed',
    meta: 'text-base',
  },
  xl: {
    container: 'p-16',
    title: 'text-4xl font-bold leading-tight',
    excerpt: 'text-xl leading-relaxed',
    meta: 'text-lg',
  },
} as const;

export function FeaturedArticle({
  title,
  excerpt,
  category,
  readTime,
  date,
  author,
  imageSlot,
  ctaText = "Read Full Article",
  href = "#",
  layout = 'horizontal',
  size = 'lg',
  className,
}: FeaturedArticleProps) {
  const sizeConfig = SizeClasses[size];
  
  const containerClasses = cn(
    'bg-gradient-to-r from-fm-magenta-700 to-fm-magenta-800 rounded-2xl overflow-hidden text-white',
    className
  );

  const gridClasses = cn(
    layout === 'horizontal' 
      ? 'grid lg:grid-cols-2 gap-0' 
      : 'grid grid-cols-1 gap-8'
  );

  const contentClasses = cn(
    sizeConfig.container
  );

  const titleClasses = cn(
    'mb-4',
    sizeConfig.title
  );

  const excerptClasses = cn(
    'text-fm-neutral-200 mb-8',
    sizeConfig.excerpt
  );

  const metaClasses = cn(
    'text-fm-neutral-200',
    sizeConfig.meta
  );

  const defaultImageSlot = (
    <div className="aspect-square lg:aspect-auto bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-4 text-fm-neutral-200">
          <ArrowRight className="w-full h-full" />
        </div>
        <p className="text-fm-neutral-200">Featured Article Visual</p>
      </div>
    </div>
  );

  return (
    <article className={containerClasses}>
      <div className={gridClasses}>
        {/* Content Section */}
        <div className={contentClasses}>
          {/* Featured Badge */}
          <div className="inline-flex items-center px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-6">
            Featured Article
          </div>
          
          {/* Category */}
          {category && (
            <Badge 
              variant="primary" 
              size="sm" 
              className="mb-4 bg-white/20 text-white border-white/40"
            >
              {category}
            </Badge>
          )}
          
          {/* Title */}
          <h2 className={titleClasses}>
            <a href={href} className="hover:text-fm-neutral-200 transition-colors">
              {title}
            </a>
          </h2>
          
          {/* Excerpt */}
          <p className={excerptClasses}>
            {excerpt}
          </p>
          
          {/* Metadata */}
          <div className={cn(
            'flex items-center gap-6 mb-8',
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
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {readTime}
            </div>
          </div>
          
          {/* CTA Button */}
          <Button 
            variant="secondary" 
            size="lg" 
            className="bg-white text-fm-magenta-700 hover:bg-fm-neutral-100"
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            {ctaText}
          </Button>
        </div>
        
        {/* Image Section */}
        {layout === 'horizontal' && (
          <div>
            {imageSlot || defaultImageSlot}
          </div>
        )}
      </div>
      
      {/* Vertical Layout Image */}
      {layout === 'vertical' && imageSlot && (
        <div className="mt-8">
          {imageSlot}
        </div>
      )}
    </article>
  );
}

export default FeaturedArticle;