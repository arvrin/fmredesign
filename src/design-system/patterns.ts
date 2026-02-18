/**
 * Design System Patterns
 * Reusable pattern functions and configurations
 */

export interface PatternTheme {
  primary: string;
  secondary: string;
  accent: string;
}

export interface AnimationPattern {
  duration: string;
  easing: string;
  delay?: string;
}

export interface TypographyPattern {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  color: string;
}

/**
 * Creates a glass card effect with backdrop blur and subtle border.
 * Overload 1: Called with a single options object, returns flat CSS properties.
 * Overload 2: Called with (theme, withGlow), returns structured class names
 *   for the GlassCard component (container, glow, card).
 */
export function createGlassCard(theme?: 'light' | 'dark' | { backgroundColor?: string; borderColor?: string; blur?: string }, withGlow?: boolean): {
  container: string;
  glow?: { outer: string; inner: string };
  card: string;
  backgroundColor: string;
  backdropFilter: string;
  border: string;
  borderRadius: string;
  boxShadow: string;
} {
  // If called with an options object (legacy usage)
  if (theme && typeof theme === 'object') {
    const {
      backgroundColor = 'rgba(255, 255, 255, 0.1)',
      borderColor = 'rgba(255, 255, 255, 0.2)',
      blur = '12px'
    } = theme;

    return {
      container: 'relative',
      card: 'relative rounded-xl backdrop-blur-sm bg-white/10 border border-white/20',
      backgroundColor,
      backdropFilter: `blur(${blur})`,
      border: `1px solid ${borderColor}`,
      borderRadius: '12px',
      boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
    };
  }

  // Called with (theme, withGlow) for GlassCard component
  const isDark = theme === 'dark';
  const baseContainer = 'relative';
  const baseCard = isDark
    ? 'relative rounded-xl backdrop-blur-sm bg-white/5 border border-white/10'
    : 'relative rounded-xl backdrop-blur-sm bg-white/80 border border-white/40';

  const result: {
    container: string;
    glow?: { outer: string; inner: string };
    card: string;
    backgroundColor: string;
    backdropFilter: string;
    border: string;
    borderRadius: string;
    boxShadow: string;
  } = {
    container: baseContainer,
    card: baseCard,
    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
    border: isDark ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid rgba(255, 255, 255, 0.4)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
  };

  if (withGlow) {
    result.glow = {
      outer: 'absolute -inset-1 rounded-xl bg-gradient-to-r from-fm-magenta-500/20 to-purple-500/20 blur-xl',
      inner: 'absolute -inset-0.5 rounded-xl bg-gradient-to-r from-fm-magenta-500/10 to-purple-500/10 blur-sm',
    };
  }

  return result;
}

/**
 * Creates a headline with accent underline
 */
export function createHeadlineWithAccent(options?: {
  accentColor?: string;
  underlineHeight?: string;
}) {
  const {
    accentColor = '#b32968',
    underlineHeight = '4px'
  } = options || {};

  return {
    position: 'relative' as const,
    '&::after': {
      content: '""',
      position: 'absolute',
      bottom: '-8px',
      left: '0',
      width: '60px',
      height: underlineHeight,
      backgroundColor: accentColor,
      borderRadius: '2px',
    }
  };
}

/**
 * Common animation patterns
 */
export const animationPatterns = {
  fadeIn: {
    duration: '0.6s',
    easing: 'ease-out',
    keyframes: `
      from { opacity: 0; }
      to { opacity: 1; }
    `
  },
  slideUp: {
    duration: '0.8s',
    easing: 'ease-out',
    keyframes: `
      from { 
        opacity: 0; 
        transform: translateY(30px); 
      }
      to { 
        opacity: 1; 
        transform: translateY(0); 
      }
    `
  },
  scaleIn: {
    duration: '0.3s',
    easing: 'ease-out',
    keyframes: `
      from { 
        opacity: 0; 
        transform: scale(0.95); 
      }
      to { 
        opacity: 1; 
        transform: scale(1); 
      }
    `
  }
};

/**
 * Typography patterns for consistent text styling
 */
export const typographyPatterns = {
  displayLarge: {
    fontFamily: 'Inter Variable, Inter, sans-serif',
    fontSize: '4rem',
    fontWeight: '700',
    lineHeight: '1.1',
    color: '#1a1a1a',
  },
  displayMedium: {
    fontFamily: 'Inter Variable, Inter, sans-serif',
    fontSize: '3rem',
    fontWeight: '700',
    lineHeight: '1.2',
    color: '#1a1a1a',
  },
  headingLarge: {
    fontFamily: 'Inter Variable, Inter, sans-serif',
    fontSize: '2rem',
    fontWeight: '600',
    lineHeight: '1.3',
    color: '#2d2d2d',
  },
  headingMedium: {
    fontFamily: 'Inter Variable, Inter, sans-serif',
    fontSize: '1.5rem',
    fontWeight: '600',
    lineHeight: '1.4',
    color: '#2d2d2d',
  },
  bodyLarge: {
    fontFamily: 'Inter Variable, Inter, sans-serif',
    fontSize: '1.125rem',
    fontWeight: '400',
    lineHeight: '1.6',
    color: '#404040',
  },
  bodyRegular: {
    fontFamily: 'Inter Variable, Inter, sans-serif',
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.6',
    color: '#404040',
  },
  captionRegular: {
    fontFamily: 'Inter Variable, Inter, sans-serif',
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.4',
    color: '#666666',
  }
};

/**
 * Color theme patterns
 */
export const themePatterns = {
  freakingMinds: {
    primary: '#b32968',
    secondary: '#ff855d',
    accent: '#fb4ca0',
  },
  monochrome: {
    primary: '#1a1a1a',
    secondary: '#404040',
    accent: '#666666',
  },
  vibrant: {
    primary: '#d73a84',
    secondary: '#ff6b35',
    accent: '#fb4ca0',
  }
};

/**
 * Card patterns for hover states and animations
 */
export const cardPatterns = {
  hover: 'hover:shadow-lg hover:scale-105 transition-all duration-300',
  base: 'bg-white rounded-lg shadow-md border border-gray-200',
  interactive: 'cursor-pointer hover:border-fm-magenta-200',
};

/**
 * Animation patterns with hover states
 */
export const extendedAnimationPatterns = {
  ...animationPatterns,
  hover: {
    scale: 'hover:scale-105 transition-transform duration-300',
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-300',
    glow: 'hover:shadow-fm-magenta-500/20 hover:shadow-xl transition-shadow duration-300',
  }
};

/**
 * Layout patterns for consistent spacing and structure
 */
export const layoutPatterns = {
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
};

/**
 * Section background patterns
 */
export const sectionBackgroundPatterns = {
  light: 'bg-gradient-to-b from-fm-neutral-50 to-fm-neutral-100',
  dark: 'bg-fm-neutral-900',
  hero: 'bg-gradient-to-br from-fm-neutral-50 to-fm-neutral-100',
};

/**
 * Extended typography patterns with body variations
 */
export const extendedTypographyPatterns = {
  ...typographyPatterns,
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
};

// Main patterns export
export const patterns = {
  animation: extendedAnimationPatterns,
  typography: extendedTypographyPatterns,
  theme: themePatterns,
  card: cardPatterns,
  layout: layoutPatterns,
  sectionBackground: sectionBackgroundPatterns,
  glass: createGlassCard,
  headline: createHeadlineWithAccent,
};