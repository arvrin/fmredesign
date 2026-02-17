import React from 'react';
import { cn } from '@/lib/utils';

export interface IconBoxProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 rounded-lg',
  md: 'w-10 h-10 rounded-lg',
  lg: 'w-12 h-12 rounded-full',
};

export const IconBox: React.FC<IconBoxProps> = ({
  children,
  size = 'md',
  className,
}) => (
  <div
    className={cn(
      'flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-fm-magenta-600 to-fm-magenta-700 text-white',
      sizeClasses[size],
      className
    )}
  >
    {children}
  </div>
);
