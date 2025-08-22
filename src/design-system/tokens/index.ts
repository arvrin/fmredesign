/**
 * Design Tokens - Single Source of Truth
 * Extracted from existing homepage design patterns
 */

export const designTokens = {
  // Color System - Based on existing Tailwind theme
  colors: {
    brand: {
      primary: '#b32968',      // fm-magenta-700
      secondary: '#e94392',    // fm-magenta-400
      accent: '#ff7849',       // fm-orange-500
      light: '#fdf2f8',        // fm-magenta-50
      border: '#fbcfe8',       // fm-magenta-200
    },
    neutral: {
      50: '#ffffff',
      100: '#f8f9fa',
      200: '#f2f2f2',
      300: '#e6e6e6',
      400: '#cccccc',
      500: '#808080',
      600: '#666666',
      700: '#404040',
      800: '#2d2d2d',
      900: '#1a1a1a',
    },
    semantic: {
      success: '#16a34a',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    }
  },

  // Typography Scale - From existing globals.css
  typography: {
    fontFamily: {
      sans: ['Inter Variable', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      display: ['Inter Variable', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'Monaco', 'Cascadia Code', 'monospace'],
    },
    fontSize: {
      'display-xl': '4rem',      // 64px
      'display-lg': '3.5rem',    // 56px
      'display-md': '3rem',      // 48px
      'h1': '2.5rem',           // 40px
      'h2': '2rem',             // 32px
      'h3': '1.5rem',           // 24px
      'h4': '1.25rem',          // 20px
      'h5': '1.125rem',         // 18px
      'h6': '1rem',             // 16px
      'body-lg': '1.125rem',    // 18px
      'body': '1rem',           // 16px
      'body-sm': '0.875rem',    // 14px
      'caption': '0.75rem',     // 12px
    },
    lineHeight: {
      'display-xl': '4.5rem',
      'display-lg': '4rem',
      'display-md': '3.5rem',
      'h1': '3rem',
      'h2': '2.5rem',
      'h3': '2rem',
      'h4': '1.75rem',
      'h5': '1.5rem',
      'h6': '1.5rem',
      'body': '1.6',
      'tight': '1.2',
      'relaxed': '1.6',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0em',
      wide: '0.025em',
    }
  },

  // Spacing System - 8px base grid
  spacing: {
    'section-sm': '4rem',      // 64px
    'section': '6rem',         // 96px
    'section-lg': '8rem',      // 128px
    'container': '2rem',       // 32px
    'card': '2rem',           // 32px
    'card-sm': '1.5rem',      // 24px
    'element': '1rem',        // 16px
    'element-sm': '0.5rem',   // 8px
  },

  // Border Radius - Consistent with current design
  borderRadius: {
    'sm': '6px',
    'md': '12px',
    'lg': '16px',
    'xl': '24px',
    'card': '24px',
    'button': '12px',
    'badge': '9999px',        // pill shape
  },

  // Box Shadows - Brand-specific magenta tints
  boxShadow: {
    'card': '0 10px 15px -3px rgba(179, 41, 104, 0.1), 0 4px 6px -2px rgba(179, 41, 104, 0.05)',
    'card-hover': '0 20px 25px -5px rgba(179, 41, 104, 0.1), 0 10px 10px -5px rgba(179, 41, 104, 0.04)',
    'button': '0 4px 6px -1px rgba(179, 41, 104, 0.1), 0 2px 4px -1px rgba(179, 41, 104, 0.06)',
    'button-hover': '0 10px 15px -3px rgba(179, 41, 104, 0.12), 0 4px 6px -2px rgba(179, 41, 104, 0.08)',
    'glow': '0 20px 25px -5px rgba(179, 41, 104, 0.15), 0 10px 10px -5px rgba(179, 41, 104, 0.1)',
    'inner': 'inset 0 2px 4px 0 rgba(179, 41, 104, 0.06)',
  },

  // Animation Timing
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
      slower: '800ms',
    },
    easing: {
      'ease-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Breakpoints - Mobile-first
  breakpoints: {
    'sm': '480px',
    'md': '768px',
    'lg': '1024px',
    'xl': '1280px',
    '2xl': '1440px',
  }
} as const;

// Type definitions for TypeScript autocomplete
export type DesignTokens = typeof designTokens;
export type ColorToken = keyof typeof designTokens.colors.brand | keyof typeof designTokens.colors.neutral;
export type SpacingToken = keyof typeof designTokens.spacing;
export type TypographyToken = keyof typeof designTokens.typography.fontSize;