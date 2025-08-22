/**
 * Enhanced Button Component - Design System Version
 * Backwards compatible with existing Button component
 */

import React from 'react';
import { patterns } from '../../../patterns';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  fullWidth?: boolean;
  animation?: 'scale' | 'shadow' | 'none';
  theme?: 'light' | 'dark';
}

const ButtonVariants = {
  light: {
    primary: 'bg-fm-magenta-700 hover:bg-fm-magenta-800 text-white border-transparent',
    secondary: 'bg-white hover:bg-fm-neutral-50 text-fm-neutral-900 border-fm-neutral-300',
    ghost: 'bg-transparent hover:bg-fm-neutral-100 text-fm-neutral-700 border-transparent',
    outline: 'bg-transparent hover:bg-fm-magenta-50 text-fm-magenta-700 border-fm-magenta-700',
  },
  dark: {
    primary: 'bg-fm-magenta-600 hover:bg-fm-magenta-700 text-white border-transparent',
    secondary: 'bg-fm-neutral-700 hover:bg-fm-neutral-600 text-white border-fm-neutral-600',
    ghost: 'bg-transparent hover:bg-fm-neutral-700/50 text-fm-neutral-200 border-transparent',
    outline: 'bg-transparent hover:bg-fm-magenta-900/20 text-fm-magenta-400 border-fm-magenta-400',
  }
} as const;

const ButtonSizes = {
  sm: 'px-3 py-2 text-sm h-9',
  md: 'px-4 py-2 text-base h-10',
  lg: 'px-6 py-3 text-lg h-12',
  xl: 'px-8 py-4 text-xl h-14',
} as const;

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  animation = 'scale',
  theme = 'light',
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-semibold rounded-xl border',
    'transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-fm-magenta-700 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
  ];

  const variantClasses = ButtonVariants[theme][variant];
  const sizeClasses = ButtonSizes[size];
  
  const animationClasses = {
    scale: patterns.button.primary,
    shadow: 'hover:shadow-lg transition-shadow duration-300',
    none: '',
  }[animation];

  const widthClasses = fullWidth ? 'w-full' : '';

  const buttonClasses = cn(
    baseClasses,
    variantClasses,
    sizeClasses,
    animationClasses,
    widthClasses,
    className
  );

  const iconClasses = 'flex-shrink-0';
  const iconSizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-5 h-5',
    xl: 'w-6 h-6',
  };
  const iconSize = iconSizeMap[size];

  const renderIcon = (position: 'left' | 'right') => {
    if (!icon || iconPosition !== position) return null;
    
    return (
      <span className={cn(
        iconClasses,
        iconSize,
        position === 'left' ? 'mr-2' : 'ml-2'
      )}>
        {icon}
      </span>
    );
  };

  const renderLoadingSpinner = () => (
    <svg 
      className={cn(iconSize, 'animate-spin mr-2')} 
      fill="none" 
      viewBox="0 0 24 24"
    >
      <circle 
        className="opacity-25" 
        cx="12" 
        cy="12" 
        r="10" 
        stroke="currentColor" 
        strokeWidth="4"
      />
      <path 
        className="opacity-75" 
        fill="currentColor" 
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && renderLoadingSpinner()}
      {!loading && renderIcon('left')}
      
      <span className={loading ? 'opacity-75' : ''}>
        {children}
      </span>
      
      {!loading && renderIcon('right')}
    </button>
  );
}

// Export default for backwards compatibility
export default Button;