/**
 * Hero Section Builder - Full-screen hero treatment for all pages
 * Combines SectionBuilder flexibility with HeroSection visual impact
 */

import React from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { Headline } from '../../atoms/Typography/Headline';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface HeroSectionBuilderProps {
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
  background?: 'light' | 'gradient' | 'minimal';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  minHeight?: 'screen' | 'large' | 'medium';
}

const MaxWidthClasses = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl', 
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[1440px]',
} as const;

const MinHeightClasses = {
  screen: 'min-h-screen',
  large: 'min-h-[80vh]',
  medium: 'min-h-[60vh]',
} as const;

export function HeroSectionBuilder({
  badge,
  headline,
  description,
  content,
  background = 'light',
  maxWidth = 'xl',
  minHeight = 'large',
  className,
}: HeroSectionBuilderProps) {
  const containerClasses = cn(
    'fm-container relative z-10',
    MaxWidthClasses[maxWidth]
  );

  const sectionClasses = cn(
    'relative flex items-center justify-center overflow-hidden py-20',
    MinHeightClasses[minHeight],
    {
      'bg-gradient-to-br from-fm-neutral-50 to-fm-neutral-100': background === 'light',
      'bg-gradient-to-br from-fm-magenta-50 via-fm-neutral-50 to-fm-neutral-100': background === 'gradient',
      'bg-fm-neutral-50': background === 'minimal',
    },
    className
  );

  const BackgroundComponent = () => {
    if (background === 'light' || background === 'gradient') {
      return (
        <div className="absolute inset-0 opacity-70 overflow-hidden">
          {/* Primary gradient - continuous smooth flow */}
          <div 
            className="absolute inset-0"
            style={{
              background: `radial-gradient(600px circle at 50% 50%, 
                rgba(179,41,104,0.3) 0%, 
                rgba(179,41,104,0.2) 25%,
                rgba(110,24,69,0.1) 50%,
                transparent 70%)`
            }}
          />
          
          {/* Secondary gradient */}
          <div 
            className="absolute inset-0 opacity-60"
            style={{
              background: `radial-gradient(800px circle at 50% 50%, 
                rgba(255,133,93,0.15) 0%,
                rgba(255,107,53,0.08) 40%,
                transparent 70%)`
            }}
          />
          
          {/* Subtle noise texture */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
          
          {/* Diagonal lines pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[linear-gradient(45deg,transparent_48%,rgba(179,41,104,0.05)_49%,rgba(179,41,104,0.05)_51%,transparent_52%)] bg-[length:30px_30px]" />
        </div>
      );
    }
    return null;
  };

  return (
    <section className={sectionClasses}>
      <BackgroundComponent />
      
      <div className={containerClasses}>
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center px-4 py-2 bg-fm-magenta-50 border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium mb-8">
              {badge.icon}
              {badge.text}
            </div>
          )}

          {/* Main Headline */}
          <Headline 
            level={headline.level || 'h1'} 
            accent={headline.accent}
            align="center"
            className="text-4xl md:text-6xl lg:text-7xl font-bold"
            style={{ marginBottom: '3rem', lineHeight: '1.1' }}
          >
            {headline.text}
          </Headline>

          {/* Description */}
          {description && (
            <p className="text-lg md:text-xl text-fm-neutral-600 text-center max-w-4xl mx-auto" style={{ marginBottom: '3.5rem', lineHeight: '1.8' }}>
              {description}
            </p>
          )}

          {/* Content/CTA Buttons */}
          <div style={{ marginBottom: '5rem' }}>
            {content}
          </div>
        </div>
      </div>

      {/* Scroll Indicator for full screen heroes */}
      {minHeight === 'screen' && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-fm-magenta-700 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-fm-magenta-700 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}

export default HeroSectionBuilder;