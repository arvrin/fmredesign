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

// Molecules
export { GlassCard } from './components/molecules/GlassCard/GlassCard';
export type { GlassCardProps } from './components/molecules/GlassCard/GlassCard';

export { ValueCard } from './components/molecules/ValueCard/ValueCard';
export type { ValueCardProps } from './components/molecules/ValueCard/ValueCard';

export { TeamCard } from './components/molecules/TeamCard/TeamCard';
export type { TeamCardProps } from './components/molecules/TeamCard/TeamCard';

export { StatCard } from './components/molecules/StatCard/StatCard';
export type { StatCardProps } from './components/molecules/StatCard/StatCard';

export { ServiceCard } from './components/molecules/ServiceCard/ServiceCard';
export type { ServiceCardProps } from './components/molecules/ServiceCard/ServiceCard';

export { PricingCard } from './components/molecules/PricingCard/PricingCard';
export type { PricingCardProps } from './components/molecules/PricingCard/PricingCard';

export { ProcessStep } from './components/molecules/ProcessStep/ProcessStep';
export type { ProcessStepProps } from './components/molecules/ProcessStep/ProcessStep';

export { CaseStudyCard } from './components/molecules/CaseStudyCard/CaseStudyCard';
export type { CaseStudyCardProps, CaseStudyResult } from './components/molecules/CaseStudyCard/CaseStudyCard';

export { PortfolioCard } from './components/molecules/PortfolioCard/PortfolioCard';
export type { PortfolioCardProps, PortfolioResult } from './components/molecules/PortfolioCard/PortfolioCard';

export { TestimonialCard } from './components/molecules/TestimonialCard/TestimonialCard';
export type { TestimonialCardProps } from './components/molecules/TestimonialCard/TestimonialCard';

export { IndustryCard } from './components/molecules/IndustryCard/IndustryCard';
export type { IndustryCardProps } from './components/molecules/IndustryCard/IndustryCard';

export { ArticleCard } from './components/molecules/ArticleCard/ArticleCard';
export type { ArticleCardProps } from './components/molecules/ArticleCard/ArticleCard';

export { CategoryFilter } from './components/molecules/CategoryFilter/CategoryFilter';
export type { CategoryFilterProps, CategoryItem } from './components/molecules/CategoryFilter/CategoryFilter';

export { SidebarWidget, NewsletterWidget, TagCloudWidget } from './components/molecules/SidebarWidget/SidebarWidget';
export type { SidebarWidgetProps, NewsletterWidgetProps, TagCloudWidgetProps } from './components/molecules/SidebarWidget/SidebarWidget';

export { FeaturedArticle } from './components/molecules/FeaturedArticle/FeaturedArticle';
export type { FeaturedArticleProps } from './components/molecules/FeaturedArticle/FeaturedArticle';

export { ContactForm } from './components/molecules/ContactForm/ContactForm';
export type { ContactFormProps, ContactFormData } from './components/molecules/ContactForm/ContactForm';

export { ContactInfo } from './components/molecules/ContactInfo/ContactInfo';
export type { ContactInfoProps, ContactInfoItem } from './components/molecules/ContactInfo/ContactInfo';

export { FAQItem, FAQSection } from './components/molecules/FAQItem/FAQItem';
export type { FAQItemProps, FAQSectionProps } from './components/molecules/FAQItem/FAQItem';

// Organisms
export { SectionBuilder } from './components/organisms/SectionBuilder/SectionBuilder';
export type { SectionBuilderProps } from './components/organisms/SectionBuilder/SectionBuilder';
export { HeroSectionBuilder } from './components/organisms/HeroSectionBuilder/HeroSectionBuilder';
export type { HeroSectionBuilderProps } from './components/organisms/HeroSectionBuilder/HeroSectionBuilder';

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
export type { DashboardLayoutProps, NavigationItem } from './components/layouts/DashboardLayout';

// Re-export utils for convenience
export { cn } from '@/lib/utils';