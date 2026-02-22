/**
 * Design System - Main Export
 * Centralized exports for all design system components
 */

// Tokens
export { designTokens } from './tokens';
export type { DesignTokens, ColorToken, SpacingToken, TypographyToken } from './tokens';

// Patterns
export { patterns, createGlassCard, createHeadlineWithAccent } from './patterns';
export type { PatternTheme, AnimationPattern, TypographyPattern } from './patterns';

// Atoms
export { Button } from './components/primitives/Button';
export type { ButtonProps } from './components/primitives/Button';

export { LinkButton } from './components/atoms/LinkButton/LinkButton';
export type { LinkButtonProps } from './components/atoms/LinkButton/LinkButton';

export { Badge } from './components/atoms/Badge/Badge';
export type { BadgeProps } from './components/atoms/Badge/Badge';

export { Headline } from './components/atoms/Typography/Headline';
export type { HeadlineProps } from './components/atoms/Typography/Headline';

// Molecules (active — used in production pages)
export { GlassCard } from './components/molecules/GlassCard/GlassCard';
export type { GlassCardProps } from './components/molecules/GlassCard/GlassCard';

export { StatCard } from './components/molecules/StatCard/StatCard';
export type { StatCardProps } from './components/molecules/StatCard/StatCard';

// Dashboard Extensions
export { Button as DashboardButton } from './components/primitives/Button';
export {
  Card as DashboardCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from './components/primitives/Card';
export { MetricCard, MetricCardSkeleton } from './components/patterns/MetricCard';
export { IconBox } from './components/patterns/IconBox';
export type { IconBoxProps } from './components/patterns/IconBox';
export { DashboardLayout } from './components/layouts/DashboardLayout';

// Dashboard Types
export type { ButtonProps as DashboardButtonProps } from './components/primitives/Button';
export type { CardProps as DashboardCardProps } from './components/primitives/Card';
export type { MetricCardProps } from './components/patterns/MetricCard';
export type { DashboardLayoutProps, NavigationItem, NavigationGroup, NotificationItem } from './components/layouts/DashboardLayout';

// Re-export utils for convenience
export { cn } from '@/lib/utils';
