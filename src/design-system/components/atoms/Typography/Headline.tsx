/**
 * Headline Component - Design System
 * Handles all headline typography with accent support
 */

import React from 'react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface HeadlineProps {
  level: 'display-xl' | 'display-lg' | 'display-md' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  accent?: {
    text: string;
    position: 'start' | 'middle' | 'end';
  };
  theme?: 'light' | 'dark';
  align?: 'left' | 'center' | 'right';
  className?: string;
  style?: React.CSSProperties;
}

const HeadlineLevels = {
  'display-xl': 'h1',
  'display-lg': 'h1', 
  'display-md': 'h1',
  'h1': 'h1',
  'h2': 'h2',
  'h3': 'h3',
  'h4': 'h4',
  'h5': 'h5',
  'h6': 'h6',
} as const;

const HeadlineClasses = {
  'display-xl': 'text-display-xl',
  'display-lg': 'text-display-lg',
  'display-md': 'text-display-md',
  'h1': 'text-h1',
  'h2': 'text-h2',
  'h3': 'text-h3',
  'h4': 'text-h4',
  'h5': 'text-h5',
  'h6': 'text-h6',
} as const;

export function Headline({
  level,
  children,
  accent,
  theme = 'light',
  align = 'left',
  className,
  style,
}: HeadlineProps) {
  const Element = HeadlineLevels[level];
  
  const baseClasses = theme === 'light' 
    ? patterns.typography.headline.primary 
    : patterns.typography.headline.white;
    
  const sizeClasses = HeadlineClasses[level];
  
  const alignClasses = {
    left: 'text-left',
    center: 'text-center', 
    right: 'text-right',
  }[align];

  const headlineClasses = cn(
    baseClasses,
    sizeClasses,
    alignClasses,
    className
  );

  // Render accent SVG underline
  const renderAccentUnderline = () => (
    <svg
      className={cn(patterns.typography.headline.underline)}
      viewBox="0 0 200 12"
      fill="currentColor"
    >
      <path 
        d="M2 8c40-6 80-6 120 0s80 6 120 0" 
        stroke="currentColor" 
        strokeWidth="4" 
        fill="none" 
      />
    </svg>
  );

  // Process children to add accent styling
  const processContent = () => {
    if (!accent) return children;

    const text = typeof children === 'string' ? children : '';
    const { text: accentText, position } = accent;
    
    if (!text.includes(accentText)) return children;

    const parts = text.split(accentText);
    
    switch (position) {
      case 'start':
        return (
          <>
            <span className={patterns.typography.headline.accent}>
              {accentText}
              {renderAccentUnderline()}
            </span>
            {parts[1]}
          </>
        );
      case 'end':
        return (
          <>
            {parts[0]}
            <span className={patterns.typography.headline.accent}>
              {accentText}
              {renderAccentUnderline()}
            </span>
          </>
        );
      case 'middle':
        return (
          <>
            {parts[0]}
            <span className={patterns.typography.headline.accent}>
              {accentText}
              {renderAccentUnderline()}
            </span>
            {parts[1]}
          </>
        );
      default:
        return children;
    }
  };

  return React.createElement(
    Element as React.ElementType,
    {
      className: headlineClasses,
      style,
    },
    processContent()
  );
}

export default Headline;