'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/design-system/tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'admin' | 'client';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const buttonVariants = {
  // Base styles
  base: [
    'inline-flex items-center justify-center font-medium transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'transform hover:scale-105 active:scale-95',
    'relative overflow-hidden'
  ].join(' '),
  
  // Variants
  variant: {
    primary: [
      'bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-fm-magenta-500',
      'hover:from-fm-magenta-700 hover:to-fm-magenta-800',
      'border border-fm-magenta-600'
    ].join(' '),
    
    secondary: [
      'bg-white text-fm-magenta-700 border border-fm-magenta-200',
      'hover:bg-fm-magenta-50 hover:border-fm-magenta-300',
      'focus:ring-fm-magenta-500 shadow-md hover:shadow-lg'
    ].join(' '),
    
    ghost: [
      'bg-transparent text-gray-700 hover:bg-gray-100',
      'focus:ring-gray-500 border border-transparent',
      'hover:border-gray-200'
    ].join(' '),
    
    danger: [
      'bg-gradient-to-r from-red-500 to-red-600',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-red-500 border border-red-500',
      'hover:from-red-600 hover:to-red-700'
    ].join(' '),
    
    admin: [
      'bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-fm-magenta-500 border border-fm-magenta-600',
      'hover:from-fm-magenta-700 hover:to-fm-magenta-800'
    ].join(' '),
    
    client: [
      'bg-gradient-to-r from-fm-magenta-500 to-fm-orange-500',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-fm-magenta-500 border border-fm-magenta-500',
      'hover:from-fm-magenta-600 hover:to-fm-orange-600'
    ].join(' ')
  },
  
  // Sizes
  size: {
    sm: 'h-9 px-3 text-sm rounded-lg gap-1.5',
    md: 'h-10 px-4 text-sm rounded-xl gap-2',
    lg: 'h-12 px-6 text-base rounded-xl gap-2',
    xl: 'h-14 px-8 text-lg rounded-2xl gap-3'
  }
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  children,
  disabled,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  return (
    <button
      ref={ref}
      className={cn(
        buttonVariants.base,
        buttonVariants.variant[variant],
        buttonVariants.size[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={isDisabled}
      {...props}
    >
      {/* Loading spinner */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      {/* Content */}
      <span className={cn('flex items-center gap-inherit', loading && 'opacity-0')}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>
      
      {/* Shine effect for premium feel */}
      {!isDisabled && (
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 hover:opacity-10 transform -skew-x-12 -translate-x-full hover:translate-x-full transition-transform duration-700"
          style={{ width: '50%' }}
        />
      )}
    </button>
  );
});

Button.displayName = 'Button';