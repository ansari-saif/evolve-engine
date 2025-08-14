/**
 * Design System Tokens - TypeScript Constants
 * 
 * This file provides type-safe access to all design tokens used throughout the application.
 * All tokens are derived from CSS custom properties defined in src/index.css.
 * 
 * Usage:
 * import { tokens } from '@/theme';
 * 
 * // Type-safe token access
 * const primaryColor = tokens.colors.primary.DEFAULT;
 * const gradient = tokens.gradients.primary;
 */

export const tokens = {
  colors: {
    primary: {
      DEFAULT: 'hsl(var(--primary))',
      dark: 'hsl(var(--primary-dark))',
      foreground: 'hsl(var(--primary-foreground))'
    },
    secondary: {
      DEFAULT: 'hsl(var(--secondary))',
      foreground: 'hsl(var(--secondary-foreground))'
    },
    success: {
      DEFAULT: 'hsl(var(--success))',
      foreground: 'hsl(var(--success-foreground))'
    },
    warning: {
      DEFAULT: 'hsl(var(--warning))',
      foreground: 'hsl(var(--warning-foreground))'
    },
    danger: {
      DEFAULT: 'hsl(var(--danger))',
      foreground: 'hsl(var(--danger-foreground))'
    },
    destructive: {
      DEFAULT: 'hsl(var(--destructive))',
      foreground: 'hsl(var(--destructive-foreground))'
    },
    muted: {
      DEFAULT: 'hsl(var(--muted))',
      foreground: 'hsl(var(--muted-foreground))'
    },
    accent: {
      DEFAULT: 'hsl(var(--accent))',
      foreground: 'hsl(var(--accent-foreground))'
    },
    card: {
      DEFAULT: 'hsl(var(--card))',
      foreground: 'hsl(var(--card-foreground))'
    },
    popover: {
      DEFAULT: 'hsl(var(--popover))',
      foreground: 'hsl(var(--popover-foreground))'
    },
    border: 'hsl(var(--border))',
    input: 'hsl(var(--input))',
    ring: 'hsl(var(--ring))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
    surface: 'hsl(var(--surface))',
    'surface-light': 'hsl(var(--surface-light))',
    'text-primary': 'hsl(var(--text-primary))',
    'text-secondary': 'hsl(var(--text-secondary))',
    'text-muted': 'hsl(var(--text-muted))',
    sidebar: {
      background: 'hsl(var(--sidebar-background))',
      foreground: 'hsl(var(--sidebar-foreground))',
      primary: 'hsl(var(--sidebar-primary))',
      'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
      accent: 'hsl(var(--sidebar-accent))',
      'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
      border: 'hsl(var(--sidebar-border))',
      ring: 'hsl(var(--sidebar-ring))'
    }
  },
  gradients: {
    primary: 'var(--gradient-primary)',
    success: 'var(--gradient-success)',
    motivation: 'var(--gradient-motivation)',
    warning: 'var(--gradient-warning)',
    subtle: 'var(--gradient-subtle)'
  },
  shadows: {
    elegant: 'var(--shadow-elegant)',
    glow: 'var(--shadow-glow)',
    card: 'var(--shadow-card)'
  },
  animations: {
    smooth: 'var(--transition-smooth)',
    spring: 'var(--transition-spring)'
  },
  spacing: {
    '0': '0px',
    '1': '0.25rem',
    '2': '0.5rem',
    '3': '0.75rem',
    '4': '1rem',
    '5': '1.25rem',
    '6': '1.5rem',
    '8': '2rem',
    '10': '2.5rem',
    '12': '3rem',
    '16': '4rem',
    '20': '5rem',
    '24': '6rem',
    '32': '8rem',
    '40': '10rem',
    '48': '12rem',
    '56': '14rem',
    '64': '16rem'
  },
  borderRadius: {
    lg: 'var(--radius)',
    md: 'calc(var(--radius) - 2px)',
    sm: 'calc(var(--radius) - 4px)'
  }
} as const;

// Type definitions for design tokens
export type DesignTokens = typeof tokens;
export type ColorTokens = typeof tokens.colors;
export type GradientTokens = typeof tokens.gradients;
export type ShadowTokens = typeof tokens.shadows;
export type AnimationTokens = typeof tokens.animations;
export type SpacingTokens = typeof tokens.spacing;
export type BorderRadiusTokens = typeof tokens.borderRadius;

// Theme type for dynamic theming
export type Theme = 'dark' | 'light' | 'startup' | 'enterprise' | 'system' | 'high-contrast' | 'lightning';

// Utility types for component props
export interface ThemeAwareProps {
  theme?: Theme;
}

// Token access utilities
export const getToken = <K extends keyof DesignTokens>(
  category: K,
  key?: keyof DesignTokens[K]
): string => {
  if (key) {
    return (tokens[category] as Record<string, string>)[key as string];
  }
  // For categories that are objects, we need to handle them differently
  const categoryValue = tokens[category];
  if (typeof categoryValue === 'string') {
    return categoryValue;
  }
  // For object categories, return a default or throw
  throw new Error(`Category ${String(category)} is an object and requires a key`);
};

// Color utilities
export const getColor = (colorKey: keyof ColorTokens): string => {
  return tokens.colors[colorKey] as string;
};

// Gradient utilities
export const getGradient = (gradientKey: keyof GradientTokens): string => {
  return tokens.gradients[gradientKey];
};

// Shadow utilities
export const getShadow = (shadowKey: keyof ShadowTokens): string => {
  return tokens.shadows[shadowKey];
};

// Animation utilities
export const getAnimation = (animationKey: keyof AnimationTokens): string => {
  return tokens.animations[animationKey];
};

export default tokens;
