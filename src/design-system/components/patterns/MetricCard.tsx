'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '../primitives/Card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: {
    value: number;
    type: 'increase' | 'decrease' | 'neutral';
    period: string;
  };
  icon?: React.ReactNode;
  variant?: 'default' | 'admin' | 'client' | 'success' | 'secondary';
  className?: string;
  loading?: boolean;
  formatter?: (value: string | number) => string;
}

const metricVariants = {
  default: {
    card: 'glass',
    accent: 'text-fm-magenta-600',
    changeIncrease: 'text-green-600 bg-green-50',
    changeDecrease: 'text-red-600 bg-red-50',
    changeNeutral: 'text-gray-600 bg-gray-50'
  },
  admin: {
    card: 'admin',
    accent: 'text-fm-magenta-700',
    changeIncrease: 'text-emerald-600 bg-emerald-50',
    changeDecrease: 'text-red-600 bg-red-50',
    changeNeutral: 'text-gray-600 bg-gray-50'
  },
  client: {
    card: 'client',
    accent: 'text-fm-magenta-700',
    changeIncrease: 'text-emerald-600 bg-emerald-50',
    changeDecrease: 'text-red-600 bg-red-50',
    changeNeutral: 'text-gray-600 bg-gray-50'
  },
  success: {
    card: 'admin',
    accent: 'text-emerald-600',
    changeIncrease: 'text-emerald-600 bg-emerald-50',
    changeDecrease: 'text-red-600 bg-red-50',
    changeNeutral: 'text-gray-600 bg-gray-50'
  },
  secondary: {
    card: 'admin',
    accent: 'text-blue-600',
    changeIncrease: 'text-emerald-600 bg-emerald-50',
    changeDecrease: 'text-red-600 bg-red-50',
    changeNeutral: 'text-gray-600 bg-gray-50'
  }
} as const;

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  change,
  icon,
  variant = 'default',
  className,
  loading = false,
  formatter
}) => {
  const variantStyles = metricVariants[variant] || metricVariants.default;
  
  const formatValue = (val: string | number): string => {
    if (formatter) return formatter(val);
    if (typeof val === 'number') {
      // Auto-format large numbers
      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
      if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
      return val.toLocaleString();
    }
    return String(val);
  };

  const getTrendIcon = () => {
    if (!change) return null;
    
    const iconProps = { size: 16, className: 'inline' };
    switch (change.type) {
      case 'increase': return <TrendingUp {...iconProps} />;
      case 'decrease': return <TrendingDown {...iconProps} />;
      case 'neutral': return <Minus {...iconProps} />;
    }
  };

  const getChangeStyles = () => {
    if (!change) return '';
    switch (change.type) {
      case 'increase': return variantStyles.changeIncrease;
      case 'decrease': return variantStyles.changeDecrease;
      case 'neutral': return variantStyles.changeNeutral;
    }
  };

  if (loading) {
    return (
      <Card variant={variantStyles.card as any} className={cn('relative', className)}>
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-6 w-6 bg-gray-200 rounded"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      variant={variantStyles.card as any} 
      className={cn('relative overflow-hidden group', className)}
      hover
      glow={variant !== 'default'}
    >
      {/* Background gradient for premium feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
          {icon && (
            <div className={cn('transition-transform duration-300 group-hover:scale-110', variantStyles.accent)}>
              {icon}
            </div>
          )}
        </div>

        {/* Main Value */}
        <div className="mb-3">
          <div className={cn(
            'text-3xl font-bold leading-none transition-all duration-300',
            'group-hover:scale-105 transform-gpu',
            variantStyles.accent
          )}>
            {formatValue(value)}
          </div>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Change Indicator */}
        {change && (
          <div className={cn(
            'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
            'transition-all duration-300 hover:scale-105',
            getChangeStyles()
          )}>
            {getTrendIcon()}
            <span>
              {change.type !== 'neutral' && (change.value > 0 ? '+' : '')}
              {change.value}%
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">{change.period}</span>
          </div>
        )}
      </div>
    </Card>
  );
};

// Skeleton component for loading states
export const MetricCardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <Card className={cn('', className)}>
    <div className="animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="h-6 w-6 bg-gray-200 rounded"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2"></div>
    </div>
  </Card>
);