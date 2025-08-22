/**
 * Glass Card Component - Design System
 * Replicates the glass-morphism pattern from homepage
 */

import React from 'react';
import { patterns, createGlassCard } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface GlassCardProps {
  children: React.ReactNode;
  theme?: 'light' | 'dark';
  withGlow?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  hover?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const PaddingClasses = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-12',
} as const;

export function GlassCard({
  children,
  theme = 'light',
  withGlow = false,
  padding = 'lg',
  hover = false,
  className,
  style,
}: GlassCardProps) {
  const glassPattern = createGlassCard(theme, withGlow);
  const paddingClasses = PaddingClasses[padding];
  const hoverClasses = hover ? patterns.card.hover : '';

  return (
    <div className={glassPattern.container} style={style}>
      {/* Render glow effects if enabled */}
      {withGlow && glassPattern.glow && (
        <>
          <div className={glassPattern.glow.outer} />
          <div className={glassPattern.glow.inner} />
        </>
      )}
      
      {/* Main card content */}
      <div className={cn(
        'relative',
        glassPattern.card,
        paddingClasses,
        hoverClasses,
        className
      )}>
        {children}
      </div>
    </div>
  );
}

export default GlassCard;