/**
 * Pricing Card Component - Design System
 * Professional pricing package display with features and CTA
 */

import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { patterns } from '../../../patterns';
import { Button } from '../../primitives/Button';
import { Badge } from '../../atoms/Badge/Badge';
import { cn } from '@/lib/utils';

export interface PricingCardProps {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular?: boolean;
  popularText?: string;
  ctaText?: string;
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SizeClasses = {
  sm: {
    card: 'p-6',
    name: 'text-lg font-semibold mb-3',
    price: 'text-2xl font-bold',
    period: 'text-sm',
    description: 'text-sm mb-6',
    feature: 'text-sm',
  },
  md: {
    card: 'p-8',
    name: 'text-xl font-semibold mb-4',
    price: 'text-3xl font-bold',
    period: 'text-base',
    description: 'text-base mb-8',
    feature: 'text-base',
  },
  lg: {
    card: 'p-10',
    name: 'text-2xl font-semibold mb-6',
    price: 'text-4xl font-bold',
    period: 'text-lg',
    description: 'text-lg mb-10',
    feature: 'text-lg',
  },
} as const;

export function PricingCard({
  name,
  price,
  period,
  description,
  features,
  popular = false,
  popularText = "Most Popular",
  ctaText = "Get Started",
  size = 'md',
  className,
}: PricingCardProps) {
  const sizeConfig = SizeClasses[size];
  
  const cardClasses = cn(
    patterns.card.base,
    sizeConfig.card,
    'relative text-center',
    popular 
      ? 'border-2 border-fm-magenta-700 shadow-xl bg-white' 
      : 'border-2 border-fm-neutral-200 bg-fm-neutral-50',
    patterns.animation.hover.lift,
    className
  );

  const nameClasses = cn(
    'text-fm-neutral-900',
    sizeConfig.name
  );

  const priceClasses = cn(
    'text-fm-magenta-700',
    sizeConfig.price
  );

  const periodClasses = cn(
    'text-fm-neutral-600',
    sizeConfig.period
  );

  const descriptionClasses = cn(
    'text-fm-neutral-600',
    sizeConfig.description
  );

  const featureClasses = cn(
    'text-fm-neutral-700',
    sizeConfig.feature
  );

  return (
    <div className={cardClasses}>
      {/* Popular Badge */}
      {popular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <Badge 
            variant="primary" 
            size="md"
            className="bg-fm-magenta-700 text-white border-fm-magenta-700"
          >
            {popularText}
          </Badge>
        </div>
      )}
      
      {/* Header */}
      <div className="mb-8">
        <h3 className={nameClasses}>
          {name}
        </h3>
        
        {/* Price */}
        <div className="flex items-baseline justify-center mb-4">
          <span className={priceClasses}>{price}</span>
          <span className={cn(periodClasses, 'ml-1')}>{period}</span>
        </div>
        
        {/* Description */}
        <p className={descriptionClasses}>
          {description}
        </p>
      </div>
      
      {/* Features List */}
      <div className="space-y-4 mb-8">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-fm-magenta-700 flex-shrink-0" />
            <span className={featureClasses}>{feature}</span>
          </div>
        ))}
      </div>
      
      {/* CTA Button */}
      <Button 
        variant={popular ? "primary" : "secondary"}
        size="lg"
        className="w-full"
        icon={<ArrowRight className="w-5 h-5" />}
        iconPosition="right"
        animation="scale"
      >
        {ctaText}
      </Button>
    </div>
  );
}

export default PricingCard;