/**
 * Design Patterns - Reusable pattern definitions
 * Extracted from existing homepage components
 */

export const patterns = {
  // Glass Container Pattern - From CTA and newsletter sections
  glassContainer: {
    light: {
      background: 'bg-white/90',
      backdropBlur: 'backdrop-blur-md',
      borderRadius: 'rounded-3xl',
      shadow: 'shadow-2xl',
      border: 'border border-white/40',
    },
    dark: {
      background: 'bg-fm-neutral-800/95',
      backdropBlur: 'backdrop-blur-sm',
      borderRadius: 'rounded-3xl',
      shadow: 'shadow-2xl',
      border: 'border border-fm-neutral-700/80',
    }
  },

  // Magenta Glow Pattern - Signature effect from homepage
  magentaGlow: {
    outer: 'absolute -inset-4 bg-gradient-to-r from-fm-magenta-400/20 via-fm-magenta-300/10 to-fm-magenta-400/20 rounded-3xl blur-2xl opacity-60',
    inner: 'absolute -inset-2 bg-fm-magenta-500/10 rounded-3xl blur-xl',
    container: 'relative', // Required parent class
  },

  // Section Background Patterns
  sectionBackground: {
    light: 'bg-gradient-to-b from-fm-neutral-50 to-fm-neutral-100',
    dark: 'bg-fm-neutral-900',
    hero: 'bg-gradient-to-br from-fm-neutral-50 to-fm-neutral-100',
  },

  // Typography Patterns - Consistent with homepage
  typography: {
    headline: {
      primary: 'font-bold text-fm-neutral-900',
      secondary: 'font-semibold text-fm-neutral-700',
      accent: 'text-fm-magenta-700 relative inline-block',
      underline: 'absolute -bottom-2 left-0 w-full h-3 text-fm-magenta-700',
      white: 'font-bold text-white',
    },
    body: {
      primary: 'text-fm-neutral-600 leading-relaxed',
      secondary: 'text-fm-neutral-500',
      light: 'text-fm-neutral-400',
      dark: 'text-fm-neutral-700',
      white: 'text-white',
    }
  },

  // Button Patterns - From existing Button component
  button: {
    primary: 'group shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105',
    secondary: 'border border-fm-neutral-300 hover:border-fm-magenta-700 transition-colors duration-300',
    ghost: 'hover:bg-fm-neutral-100 transition-colors duration-300',
  },

  // Badge Pattern - Consistent across all sections
  badge: {
    standard: 'inline-flex items-center px-4 py-2 bg-fm-magenta-50/80 backdrop-blur-sm border border-fm-magenta-200 rounded-full text-fm-magenta-700 text-sm font-medium',
    dark: 'inline-flex items-center px-4 py-2 bg-fm-magenta-400/20 backdrop-blur-sm border border-fm-magenta-400/40 rounded-full text-fm-magenta-200 text-sm font-semibold',
    glow: 'badge-glow', // Animation class
  },

  // Card Patterns
  card: {
    base: 'bg-white border border-fm-neutral-200 rounded-2xl shadow-lg',
    hover: 'hover:shadow-xl transition-shadow duration-300',
    interactive: 'cursor-pointer transform transition-transform duration-300 hover:scale-105',
    glass: 'bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl shadow-lg',
  },

  // Form Patterns
  form: {
    input: {
      base: 'w-full px-4 py-3 rounded-xl border transition-all duration-300',
      light: 'bg-fm-neutral-100/80 border-fm-neutral-300 text-fm-neutral-900 placeholder-fm-neutral-500',
      dark: 'bg-fm-neutral-700/90 border-fm-neutral-600/80 text-white placeholder-fm-neutral-400',
      focus: 'focus:ring-2 focus:ring-fm-magenta-700 focus:border-fm-magenta-700',
    },
    label: 'block text-sm font-semibold text-fm-neutral-900 mb-2',
  },

  // Layout Patterns
  layout: {
    section: 'relative py-0 overflow-visible',
    container: 'relative z-10 px-4 md:px-8 lg:px-16 mx-auto',
    maxWidth: {
      sm: 'max-w-4xl',
      md: 'max-w-5xl',
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-[1440px]',
    },
    grid: {
      responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8',
      cards: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
    }
  },

  // Animation Classes - From existing CSS
  animation: {
    entrance: {
      fadeIn: 'animate-fade-in',
      fadeInUp: 'animate-fade-in-up',
      scaleIn: 'animate-scale-in',
    },
    hover: {
      scale: 'transform transition-transform duration-300 hover:scale-105',
      shadow: 'transition-shadow duration-300 hover:shadow-xl',
      lift: 'transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl',
    },
    loading: {
      pulse: 'animate-pulse',
      spin: 'animate-spin',
    }
  }
} as const;

// Helper functions for pattern composition
export const createGlassCard = (theme: 'light' | 'dark' = 'light', withGlow: boolean = false) => {
  const base = patterns.glassContainer[theme];
  const glow = withGlow ? patterns.magentaGlow : null;
  
  return {
    container: glow ? patterns.magentaGlow.container : 'relative',
    glow,
    card: `${base.background} ${base.backdropBlur} ${base.borderRadius} ${base.shadow} ${base.border}`,
  };
};

export const createHeadlineWithAccent = () => {
  return {
    base: patterns.typography.headline.primary,
    accent: patterns.typography.headline.accent,
    underlineSvg: patterns.typography.headline.underline,
  };
};

// Type definitions
export type PatternTheme = 'light' | 'dark';
export type AnimationPattern = keyof typeof patterns.animation.entrance;
export type TypographyPattern = keyof typeof patterns.typography.headline;