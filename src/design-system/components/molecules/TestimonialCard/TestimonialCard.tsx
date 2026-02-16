/**
 * Testimonial Card Component - Design System
 * Client testimonial display with rating and attribution
 */

import React from 'react';
import { Star } from 'lucide-react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface TestimonialCardProps {
  name: string;
  company: string;
  role: string;
  content: string;
  rating?: number;
  avatar?: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  showQuotes?: boolean;
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-6',
    content: 'text-sm mb-4',
    name: 'text-base font-semibold',
    role: 'text-sm',
    stars: 'w-4 h-4',
  },
  md: {
    card: 'p-8',
    content: 'text-base mb-6',
    name: 'text-lg font-semibold',
    role: 'text-sm',
    stars: 'w-5 h-5',
  },
  lg: {
    card: 'p-10',
    content: 'text-lg mb-8',
    name: 'text-xl font-semibold',
    role: 'text-base',
    stars: 'w-6 h-6',
  },
} as const;

export function TestimonialCard({
  name,
  company,
  role,
  content,
  rating = 5,
  avatar,
  theme = 'light',
  size = 'md',
  showQuotes = true,
  className,
}: TestimonialCardProps) {
  const sizeConfig = SizeClasses[size];
  
  const cardClasses = cn(
    patterns.card.base,
    sizeConfig.card,
    patterns.card.hover,
    className
  );

  const contentClasses = cn(
    'leading-relaxed',
    theme === 'light' ? 'text-fm-neutral-700' : 'text-fm-neutral-200',
    sizeConfig.content
  );

  const nameClasses = cn(
    theme === 'light' ? 'text-fm-neutral-900' : 'text-white',
    sizeConfig.name
  );

  const roleClasses = cn(
    theme === 'light' ? 'text-fm-neutral-600' : 'text-fm-neutral-300',
    sizeConfig.role
  );

  return (
    <div className={cardClasses}>
      {/* Rating Stars */}
      {rating > 0 && (
        <div className="flex items-center mb-4">
          {[...Array(rating)].map((_, index) => (
            <Star 
              key={index} 
              className={cn(
                'fill-fm-magenta-500 text-fm-magenta-500',
                sizeConfig.stars
              )} 
            />
          ))}
        </div>
      )}
      
      {/* Content */}
      <div className={contentClasses}>
        {showQuotes && '"'}
        {content}
        {showQuotes && '"'}
      </div>
      
      {/* Attribution */}
      <div className="flex items-center gap-4">
        {/* Avatar */}
        {avatar && (
          <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img 
              src={avatar} 
              alt={`${name} - Client Photo`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Name and Role */}
        <div className={!avatar ? 'w-full' : ''}>
          <div className={nameClasses}>
            {name}
          </div>
          <div className={roleClasses}>
            {role}, {company}
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestimonialCard;