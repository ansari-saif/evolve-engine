# Design Tokens - Evolve Engine

## Overview

Design tokens are the foundational elements of our design system. They define colors, typography, spacing, shadows, and other visual properties that ensure consistency across the Evolve Engine platform.

## Color Tokens

### Primary Colors
```css
/* Brand Identity */
--primary: 231 48% 63%;          /* #6366F1 - Indigo Primary */
--primary-dark: 232 54% 56%;     /* #4F46E5 - Indigo Dark */
--primary-foreground: 210 20% 95%; /* #F1F5F9 - White text on primary */

/* Secondary */
--secondary: 328 86% 70%;        /* #EC4899 - Motivation Pink */
--secondary-foreground: 210 20% 95%; /* #F1F5F9 - White text */
```

### Semantic Colors
```css
/* Success */
--success: 158 64% 52%;          /* #22C55E - Success Green */
--success-foreground: 210 20% 95%; /* #F1F5F9 - White text */

/* Warning */
--warning: 43 96% 56%;           /* #F59E0B - Warning Amber */
--warning-foreground: 220 13% 6%; /* #0F172A - Dark text on warning */

/* Danger */
--danger: 0 84% 60%;             /* #EF4444 - Danger Red */
--danger-foreground: 210 20% 95%; /* #F1F5F9 - White text */

/* Destructive */
--destructive: 0 84% 60%;        /* #EF4444 - Danger Red */
--destructive-foreground: 210 20% 95%; /* #F1F5F9 - White text */
```

### Background Colors
```css
/* Main backgrounds */
--background: 220 13% 6%;        /* #0F172A - Deep slate */
--foreground: 210 20% 95%;       /* #F1F5F9 - Text primary */

/* Surface colors */
--surface: 217 19% 12%;          /* #1E293B - Surface */
--surface-light: 215 16% 17%;    /* #334155 - Surface light */

/* Card backgrounds */
--card: 217 19% 12%;             /* #1E293B - Card background */
--card-foreground: 210 20% 95%;  /* #F1F5F9 - Card text */

/* Popover backgrounds */
--popover: 217 19% 12%;          /* #1E293B - Popover background */
--popover-foreground: 210 20% 95%; /* #F1F5F9 - Popover text */
```

### Text Colors
```css
/* Text hierarchy */
--text-primary: 210 20% 95%;     /* #F1F5F9 - Primary text */
--text-secondary: 215 16% 65%;   /* #94A3B8 - Secondary text */
--text-muted: 215 20% 45%;       /* #64748B - Muted text */
```

### Interactive Colors
```css
/* Muted backgrounds */
--muted: 215 16% 17%;            /* #334155 - Muted background */
--muted-foreground: 215 16% 65%; /* #94A3B8 - Muted text */

/* Accent backgrounds */
--accent: 215 16% 17%;           /* #334155 - Accent background */
--accent-foreground: 210 20% 95%; /* #F1F5F9 - Accent text */

/* Borders and inputs */
--border: 215 16% 17%;           /* #334155 - Border */
--input: 215 16% 17%;            /* #334155 - Input borders */
--ring: 231 48% 63%;             /* #6366F1 - Focus rings */
```

## Gradient Tokens

### Primary Gradients
```css
/* Brand gradients */
--gradient-primary: linear-gradient(135deg, hsl(231 48% 63%) 0%, hsl(250 84% 70%) 100%);
--gradient-success: linear-gradient(135deg, hsl(158 64% 52%) 0%, hsl(158 84% 45%) 100%);
--gradient-motivation: linear-gradient(135deg, hsl(328 86% 70%) 0%, hsl(347 77% 65%) 100%);
--gradient-warning: linear-gradient(135deg, hsl(43 96% 56%) 0%, hsl(38 92% 50%) 100%);
--gradient-subtle: linear-gradient(180deg, hsl(217 19% 12%) 0%, hsl(220 13% 9%) 100%);
```

### Usage Examples
```css
/* Background gradients */
.bg-gradient-primary { background: var(--gradient-primary); }
.bg-gradient-success { background: var(--gradient-success); }
.bg-gradient-motivation { background: var(--gradient-motivation); }
.bg-gradient-warning { background: var(--gradient-warning); }
.bg-gradient-subtle { background: var(--gradient-subtle); }

/* Text gradients */
.text-gradient-primary {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.text-gradient-motivation {
  background: var(--gradient-motivation);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

## Shadow Tokens

### Shadow System
```css
/* Primary shadows */
--shadow-elegant: 0 10px 30px -10px hsl(231 48% 63% / 0.3);
--shadow-glow: 0 0 40px hsl(231 48% 70% / 0.4);
--shadow-card: 0 4px 16px -4px hsl(217 19% 8% / 0.4);
```

### Usage Examples
```css
/* Shadow utilities */
.shadow-elegant { box-shadow: var(--shadow-elegant); }
.shadow-glow { box-shadow: var(--shadow-glow); }
.shadow-card { box-shadow: var(--shadow-card); }
```

## Typography Tokens

### Font Families
```css
/* Font stacks */
--font-sans: Inter, system-ui, sans-serif;
--font-mono: JetBrains Mono, Consolas, monospace;
```

### Font Sizes
```css
/* Typography scale */
--text-xs: 0.75rem;    /* 12px - Caption */
--text-sm: 0.875rem;   /* 14px - Body Small */
--text-base: 1rem;     /* 16px - Body */
--text-lg: 1.125rem;   /* 18px - Body Large */
--text-xl: 1.25rem;    /* 20px - Subheading */
--text-2xl: 1.5rem;    /* 24px - Subheading */
--text-3xl: 1.875rem;  /* 30px - Heading */
--text-4xl: 2.25rem;   /* 36px - Title */
--text-5xl: 3.5rem;    /* 56px - Hero */
```

### Font Weights
```css
/* Font weights */
--font-light: 300;
--font-normal: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;
--font-extrabold: 800;
```

### Line Heights
```css
/* Line heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

## Spacing Tokens

### Spacing Scale
```css
/* Spacing values */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
--space-24: 6rem;     /* 96px */
```

### Component Spacing
```css
/* Component-specific spacing */
--button-padding-x: 1.5rem;      /* 24px */
--button-padding-y: 0.75rem;     /* 12px */
--card-padding: 1.5rem;          /* 24px */
--form-spacing: 1rem;            /* 16px */
--section-spacing: 3rem;         /* 48px */
```

## Border Tokens

### Border Radius
```css
/* Border radius values */
--radius: 0.75rem;               /* 12px - Base radius */
--radius-sm: calc(var(--radius) - 4px);  /* 8px */
--radius-md: calc(var(--radius) - 2px);  /* 10px */
--radius-lg: var(--radius);              /* 12px */
--radius-xl: 1rem;               /* 16px */
--radius-2xl: 1.5rem;            /* 24px */
--radius-full: 9999px;           /* Full circle */
```

### Border Widths
```css
/* Border widths */
--border-0: 0;
--border: 1px;
--border-2: 2px;
--border-4: 4px;
--border-8: 8px;
```

## Animation Tokens

### Transition Durations
```css
/* Transition durations */
--duration-75: 75ms;
--duration-100: 100ms;
--duration-150: 150ms;
--duration-200: 200ms;
--duration-300: 300ms;
--duration-500: 500ms;
--duration-700: 700ms;
--duration-1000: 1000ms;
```

### Transition Timing Functions
```css
/* Transition curves */
--transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
--transition-spring: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
--ease-linear: linear;
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Delays
```css
/* Animation delays */
--delay-75: 75ms;
--delay-100: 100ms;
--delay-150: 150ms;
--delay-200: 200ms;
--delay-300: 300ms;
--delay-500: 500ms;
--delay-700: 700ms;
--delay-1000: 1000ms;
```

## Z-Index Tokens

### Z-Index Scale
```css
/* Z-index values */
--z-0: 0;
--z-10: 10;
--z-20: 20;
--z-30: 30;
--z-40: 40;
--z-50: 50;
--z-auto: auto;
```

### Component Z-Indices
```css
/* Component-specific z-indices */
--z-dropdown: 1000;
--z-sticky: 1020;
--z-fixed: 1030;
--z-modal-backdrop: 1040;
--z-modal: 1050;
--z-popover: 1060;
--z-tooltip: 1070;
--z-toast: 1080;
```

## Glass Component Tokens

### LiquidGlass Intensity
```css
/* Intensity levels for liquid effects */
--liquid-intensity-low: 1-3;     /* Subtle background effects */
--liquid-intensity-medium: 4-6;  /* Standard interactive elements */
--liquid-intensity-high: 7-8;    /* Prominent features */
--liquid-intensity-max: 9-10;    /* Hero sections */
```

### Bend Factor
```css
/* 3D bend intensity */
--bend-factor-none: 0;           /* No 3D effect */
--bend-factor-subtle: 0.25;      /* Subtle 3D effect */
--bend-factor-normal: 0.5;       /* Standard 3D effect */
--bend-factor-strong: 0.75;      /* Strong 3D effect */
--bend-factor-max: 1;            /* Maximum 3D effect */
```

## Utility Classes

### Glass Effects
```css
/* Glass morphism utilities */
.glass {
  @apply bg-card/80 backdrop-blur-xl border border-border/50;
}

.liquid-glass {
  @apply relative overflow-hidden backdrop-blur-md transition-all duration-300;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.liquid-glass:hover {
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}
```

### Hover Effects
```css
/* Hover animation utilities */
.hover-scale {
  @apply transition-all duration-200 hover:scale-105;
}

.hover-glow {
  @apply transition-all duration-300 hover:shadow-glow;
}

.hover-lift {
  @apply transition-all duration-300 hover:-translate-y-1 hover:shadow-lg;
}
```

## Usage Guidelines

### Token Naming Convention
- Use semantic names over specific values
- Follow the pattern: `--category-subcategory-variant`
- Use kebab-case for all token names
- Include comments with hex values for reference

### Implementation Best Practices
1. **Use CSS custom properties** for all design tokens
2. **Reference tokens semantically** in components
3. **Maintain consistency** across all implementations
4. **Document changes** when updating tokens
5. **Test accessibility** for all color combinations

### Token Organization
- Group related tokens together
- Use consistent naming patterns
- Include usage examples where helpful
- Maintain clear documentation

---

*These design tokens form the foundation of the Evolve Engine design system. Use them consistently to maintain visual harmony across the platform.*
