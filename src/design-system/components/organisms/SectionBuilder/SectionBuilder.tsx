/**
 * Section Builder - Organism Component
 * Replicates the pattern from homepage sections
 */

import React from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { Headline } from '../../atoms/Typography/Headline';
import { GlassCard } from '../../molecules/GlassCard/GlassCard';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface SectionBuilderProps {
  badge?: {
    text: string;
    icon?: React.ReactNode;
    variant?: 'standard' | 'dark';
  };
  headline: {
    text: string;
    level?: 'h1' | 'h2' | 'h3';
    accent?: { text: string; position: 'start' | 'middle' | 'end' };
  };
  description?: string;
  content: React.ReactNode;
  background?: 'light' | 'dark' | 'gradient' | 'none';
  withGlow?: boolean;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const MaxWidthClasses = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1440px]',
} as const;

const PaddingClasses = {
  sm: 'py-16',
  md: 'py-20',
  lg: 'py-24',
  xl: 'py-32',
} as const;

export function SectionBuilder({
  badge,
  headline,
  description,
  content,
  background = 'light',
  withGlow = false,
  maxWidth = 'xl',
  padding = 'lg',
  className,
}: SectionBuilderProps) {
  const backgroundClasses = {
    light: patterns.sectionBackground.light,
    dark: patterns.sectionBackground.dark,
    gradient: 'bg-gradient-to-br from-fm-magenta-50 via-fm-neutral-50 to-fm-neutral-100',
    none: '',
  }[background];

  const sectionClasses = cn(
    patterns.layout.section,
    backgroundClasses,
    PaddingClasses[padding],
    className
  );

  const containerClasses = cn(
    patterns.layout.container,
    MaxWidthClasses[maxWidth]
  );

  return (
    <section className={sectionClasses}>
      <div className={containerClasses}>
        {/* Section Header */}
        <div className="text-center mb-16">
          {badge && (
            <div className="flex justify-center mb-8">
              <Badge 
                variant={badge.variant || 'standard'} 
                icon={badge.icon}
                glow={true}
              >
                {badge.text}
              </Badge>
            </div>
          )}
          
          <Headline 
            level={headline.level || 'h2'} 
            accent={headline.accent}
            align="center"
            className="mb-6"
            theme={background === 'dark' ? 'dark' : 'light'}
          >
            {headline.text}
          </Headline>
          
          {description && (
            <div className="flex justify-center">
              <p className={cn(
                patterns.typography.body.primary,
                'text-center max-w-2xl',
                background === 'dark' ? 'text-fm-neutral-300' : ''
              )}>
                {description}
              </p>
            </div>
          )}
        </div>
        
        {/* Section Content */}
        <GlassCard 
          theme={background === 'dark' ? 'dark' : 'light'}
          withGlow={withGlow}
          padding="xl"
        >
          {content}
        </GlassCard>
      </div>
    </section>
  );
}

export default SectionBuilder;