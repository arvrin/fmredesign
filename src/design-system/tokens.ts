/**
 * Design System Tokens
 * Central configuration for design system values
 */

export interface ColorToken {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface SpacingToken {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface TypographyToken {
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing?: string;
}

export interface DesignTokens {
  colors: {
    primary: ColorToken;
    secondary: ColorToken;
    neutral: ColorToken;
    success: ColorToken;
    warning: ColorToken;
    error: ColorToken;
  };
  spacing: SpacingToken;
  typography: {
    display: TypographyToken;
    heading: TypographyToken;
    body: TypographyToken;
    caption: TypographyToken;
  };
  borderRadius: SpacingToken;
  boxShadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

export const designTokens: DesignTokens = {
  colors: {
    primary: {
      50: '#fdf2f8',
      100: '#fce7f3',
      200: '#fbcfe8',
      300: '#fb4ca0',
      400: '#e94392',
      500: '#d73a84',
      600: '#c53276',
      700: '#b32968',
      800: '#a1215a',
      900: '#8f184c',
    },
    secondary: {
      50: '#fff7ed',
      100: '#ffedd5',
      200: '#fed7aa',
      300: '#ff855d',
      400: '#ff7849',
      500: '#ff6b35',
      600: '#f56500',
      700: '#ea580c',
      800: '#dc2626',
      900: '#991b1b',
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
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#16a34a',
      600: '#059669',
      700: '#047857',
      800: '#065f46',
      900: '#064e3b',
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      200: '#fde68a',
      300: '#fcd34d',
      400: '#fbbf24',
      500: '#f59e0b',
      600: '#d97706',
      700: '#b45309',
      800: '#92400e',
      900: '#78350f',
    },
    error: {
      50: '#fef2f2',
      100: '#fee2e2',
      200: '#fecaca',
      300: '#fca5a5',
      400: '#f87171',
      500: '#ef4444',
      600: '#dc2626',
      700: '#b91c1c',
      800: '#991b1b',
      900: '#7f1d1d',
    },
  },
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '3rem',  // 48px
    '3xl': '4rem',  // 64px
  },
  typography: {
    display: {
      fontFamily: 'Inter Variable, Inter, sans-serif',
      fontSize: '3rem',
      fontWeight: '700',
      lineHeight: '1.1',
      letterSpacing: '-0.02em',
    },
    heading: {
      fontFamily: 'Inter Variable, Inter, sans-serif',
      fontSize: '1.5rem',
      fontWeight: '600',
      lineHeight: '1.3',
      letterSpacing: '-0.01em',
    },
    body: {
      fontFamily: 'Inter Variable, Inter, sans-serif',
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.6',
    },
    caption: {
      fontFamily: 'Inter Variable, Inter, sans-serif',
      fontSize: '0.875rem',
      fontWeight: '400',
      lineHeight: '1.4',
    },
  },
  borderRadius: {
    xs: '0.125rem',  // 2px
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    '2xl': '1.5rem', // 24px
    '3xl': '2rem',   // 32px
  },
  boxShadow: {
    sm: '0 1px 2px 0 rgba(143, 24, 76, 0.05)',
    md: '0 4px 6px -1px rgba(143, 24, 76, 0.1), 0 2px 4px -1px rgba(143, 24, 76, 0.06)',
    lg: '0 10px 15px -3px rgba(143, 24, 76, 0.1), 0 4px 6px -2px rgba(143, 24, 76, 0.05)',
    xl: '0 20px 25px -5px rgba(143, 24, 76, 0.1), 0 10px 10px -5px rgba(143, 24, 76, 0.04)',
  },
};

// Export individual token categories for convenience
export const { colors, spacing, typography, borderRadius, boxShadow } = designTokens;