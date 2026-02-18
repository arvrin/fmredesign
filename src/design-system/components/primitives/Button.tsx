'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { designTokens } from '@/design-system/tokens';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'admin' | 'client' | 'outline' | 'default' | 'destructive' | 'accent';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  theme?: 'light' | 'dark';
  animation?: string;
}

const buttonVariants = {
  // Base styles — includes 'group' so child shine div can use group-hover
  base: [
    'inline-flex items-center justify-center font-medium transition-all duration-300',
    'focus:outline-none focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'transform hover:scale-105 active:scale-95',
    'relative overflow-hidden group'
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
      'bg-transparent text-fm-neutral-700 hover:bg-fm-neutral-100',
      'focus:ring-fm-neutral-500 border border-transparent',
      'hover:border-fm-neutral-200'
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
      'bg-gradient-to-r from-fm-magenta-600 to-fm-magenta-700',
      'text-white shadow-[0_10px_40px_rgba(168,37,72,0.3)] hover:shadow-[0_14px_48px_rgba(168,37,72,0.4)]',
      'focus:ring-fm-magenta-500 border border-fm-magenta-600',
      'hover:from-fm-magenta-700 hover:to-fm-magenta-800',
      'rounded-full'
    ].join(' '),

    outline: [
      'bg-white text-fm-magenta-700 border border-fm-magenta-200',
      'hover:bg-fm-magenta-50 hover:border-fm-magenta-300',
      'focus:ring-fm-magenta-500 shadow-md hover:shadow-lg'
    ].join(' '),

    default: [
      'bg-white text-fm-neutral-700 border border-fm-neutral-200',
      'hover:bg-fm-neutral-50 hover:border-fm-neutral-300',
      'focus:ring-fm-neutral-500 shadow-sm hover:shadow-md'
    ].join(' '),

    destructive: [
      'bg-gradient-to-r from-red-500 to-red-600',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-red-500 border border-red-500',
      'hover:from-red-600 hover:to-red-700'
    ].join(' '),

    accent: [
      'bg-gradient-to-r from-fm-magenta-500 to-orange-500',
      'text-white shadow-lg hover:shadow-xl',
      'focus:ring-fm-magenta-500 border border-fm-magenta-500'
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
  theme: _theme,
  animation: _animation,
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
      <span className={cn('flex items-center gap-2', loading && 'opacity-0')}>
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {children && <span>{children}</span>}
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </span>

      {/* Shine effect — uses group-hover so it triggers when button is hovered */}
      {!isDisabled && (
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-700 pointer-events-none"
          style={{ width: '50%' }}
        />
      )}
    </button>
  );
});

Button.displayName = 'Button';
