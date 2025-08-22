/**
 * Category Filter Component - Design System
 * Interactive category filter with counts and active states
 */

'use client';

import React from 'react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface CategoryItem {
  name: string;
  count: number;
  active?: boolean;
  slug?: string;
}

export interface CategoryFilterProps {
  categories: CategoryItem[];
  onCategoryChange?: (category: CategoryItem) => void;
  size?: 'sm' | 'md' | 'lg';
  layout?: 'horizontal' | 'vertical';
  theme?: 'light' | 'dark';
  showCounts?: boolean;
  className?: string;
}

const SizeClasses = {
  sm: {
    button: 'px-3 py-1 text-xs',
    gap: 'gap-2',
  },
  md: {
    button: 'px-4 py-2 text-sm',
    gap: 'gap-3',
  },
  lg: {
    button: 'px-6 py-3 text-base',
    gap: 'gap-4',
  },
} as const;

const LayoutClasses = {
  horizontal: 'flex flex-wrap',
  vertical: 'flex flex-col',
} as const;

export function CategoryFilter({
  categories,
  onCategoryChange,
  size = 'md',
  layout = 'horizontal',
  theme = 'light',
  showCounts = true,
  className,
}: CategoryFilterProps) {
  const sizeConfig = SizeClasses[size];
  
  const containerClasses = cn(
    LayoutClasses[layout],
    sizeConfig.gap,
    className
  );

  const getButtonClasses = (isActive: boolean) => cn(
    'rounded-lg font-medium transition-all duration-300 cursor-pointer border',
    sizeConfig.button,
    isActive 
      ? theme === 'light'
        ? 'bg-fm-magenta-700 text-white border-fm-magenta-700 shadow-lg'
        : 'bg-fm-magenta-600 text-white border-fm-magenta-600 shadow-lg'
      : theme === 'light'
        ? 'bg-fm-neutral-200 text-fm-neutral-700 border-fm-neutral-200 hover:bg-fm-neutral-300 hover:border-fm-neutral-300'
        : 'bg-fm-neutral-700 text-fm-neutral-200 border-fm-neutral-700 hover:bg-fm-neutral-600 hover:border-fm-neutral-600',
    patterns.animation.hover.scale
  );

  const handleCategoryClick = (category: CategoryItem) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className={containerClasses}>
      {categories.map((category, index) => (
        <button
          key={category.slug || index}
          onClick={() => handleCategoryClick(category)}
          className={getButtonClasses(category.active || false)}
          aria-selected={category.active}
          role="tab"
        >
          <span>{category.name}</span>
          {showCounts && (
            <span className="ml-1 opacity-75">
              ({category.count})
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export default CategoryFilter;