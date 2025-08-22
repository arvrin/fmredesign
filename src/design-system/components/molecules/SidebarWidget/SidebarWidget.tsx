/**
 * Sidebar Widget Component - Design System
 * Reusable sidebar content blocks for newsletter, tags, recent posts
 */

'use client';

import React from 'react';
import { Button } from '../../atoms/Button/Button';
import { cn } from '@/lib/utils';

export interface SidebarWidgetProps {
  title: string;
  children: React.ReactNode;
  variant?: 'default' | 'newsletter' | 'highlighted';
  theme?: 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SizeClasses = {
  sm: {
    container: 'p-4',
    title: 'text-base font-semibold mb-3',
  },
  md: {
    container: 'p-6',
    title: 'text-lg font-semibold mb-4',
  },
  lg: {
    container: 'p-8',
    title: 'text-xl font-semibold mb-6',
  },
} as const;

const VariantClasses = {
  default: {
    light: 'bg-fm-neutral-50 border border-fm-neutral-200',
    dark: 'bg-fm-neutral-800 border border-fm-neutral-700',
  },
  newsletter: {
    light: 'bg-fm-magenta-700 text-white',
    dark: 'bg-fm-magenta-800 text-white',
  },
  highlighted: {
    light: 'bg-gradient-to-br from-fm-magenta-50 to-fm-magenta-100 border border-fm-magenta-200',
    dark: 'bg-gradient-to-br from-fm-neutral-800 to-fm-neutral-900 border border-fm-magenta-700',
  },
} as const;

export function SidebarWidget({
  title,
  children,
  variant = 'default',
  theme = 'light',
  size = 'md',
  className,
}: SidebarWidgetProps) {
  const sizeConfig = SizeClasses[size];
  const variantConfig = VariantClasses[variant];
  
  const containerClasses = cn(
    'rounded-xl',
    sizeConfig.container,
    variantConfig[theme],
    className
  );

  const titleClasses = cn(
    sizeConfig.title,
    variant === 'newsletter' 
      ? 'text-white' 
      : theme === 'light' 
        ? 'text-fm-neutral-900' 
        : 'text-white'
  );

  return (
    <div className={containerClasses}>
      <h3 className={titleClasses}>
        {title}
      </h3>
      <div>
        {children}
      </div>
    </div>
  );
}

// Newsletter Widget - Specialized variant
export interface NewsletterWidgetProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (email: string) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function NewsletterWidget({
  title = "Stay Updated",
  description = "Get the latest digital marketing insights delivered to your inbox weekly.",
  placeholder = "Your email address",
  buttonText = "Subscribe",
  onSubmit,
  size = 'md',
  className,
}: NewsletterWidgetProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && email) {
      onSubmit(email);
      setEmail('');
    }
  };

  return (
    <SidebarWidget
      title={title}
      variant="newsletter"
      size={size}
      className={className}
    >
      <p className="text-fm-neutral-200 mb-6 text-sm">
        {description}
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 rounded-lg text-fm-neutral-900 placeholder-fm-neutral-500 border-0 focus:ring-2 focus:ring-fm-magenta-400"
          required
        />
        <Button 
          type="submit"
          variant="secondary" 
          size="sm" 
          className="w-full bg-fm-neutral-50 text-fm-magenta-700 hover:bg-fm-neutral-100"
        >
          {buttonText}
        </Button>
      </form>
    </SidebarWidget>
  );
}

// Tag Cloud Widget - Specialized variant
export interface TagCloudWidgetProps {
  title?: string;
  tags: string[];
  onTagClick?: (tag: string) => void;
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
  className?: string;
}

export function TagCloudWidget({
  title = "Popular Tags",
  tags,
  onTagClick,
  size = 'md',
  theme = 'light',
  className,
}: TagCloudWidgetProps) {
  return (
    <SidebarWidget
      title={title}
      variant="default"
      theme={theme}
      size={size}
      className={className}
    >
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <button
            key={index}
            onClick={() => onTagClick && onTagClick(tag)}
            className={cn(
              'text-xs px-3 py-2 rounded transition-colors',
              theme === 'light'
                ? 'bg-fm-neutral-200 text-fm-neutral-700 hover:bg-fm-magenta-100 hover:text-fm-magenta-700'
                : 'bg-fm-neutral-700 text-fm-neutral-300 hover:bg-fm-magenta-700 hover:text-white'
            )}
          >
            #{tag}
          </button>
        ))}
      </div>
    </SidebarWidget>
  );
}

export default SidebarWidget;