# Brand Guidelines & Design System

## Overview

Our design system is built on a foundation of **type-safe design tokens** that provide consistent, maintainable, and scalable design patterns across the entire application. This system enables rapid theme switching, ensures visual consistency, and prevents design drift.

## 🎨 Design Tokens

### Core Principles

1. **Type Safety**: All design values are accessed through TypeScript constants
2. **Single Source of Truth**: Tokens are defined once and used everywhere
3. **Runtime Flexibility**: Themes can be switched dynamically without page reload
4. **Developer Experience**: Full IDE autocomplete and validation

### Token Categories

#### Colors
```typescript
import { tokens } from '../theme';

// Primary colors
tokens.colors.primary.DEFAULT    // Main brand color
tokens.colors.primary.50         // Lightest shade
tokens.colors.primary.900        // Darkest shade

// Semantic colors
tokens.colors.success.DEFAULT    // Success states
tokens.colors.warning.DEFAULT    // Warning states
tokens.colors.error.DEFAULT      // Error states
```

#### Gradients
```typescript
// Predefined gradients
tokens.gradients.primary.DEFAULT
tokens.gradients.accent.secondary
tokens.gradients.success.tertiary
```

#### Shadows
```typescript
// Elevation shadows
tokens.shadows.sm.DEFAULT        // Small elevation
tokens.shadows.lg.DEFAULT        // Large elevation
tokens.shadows.inner.DEFAULT     // Inset shadows
```

#### Animations
```typescript
// Motion tokens
tokens.animations.fadeIn.DEFAULT
tokens.animations.slideInFromTop.DEFAULT
tokens.animations.zoomIn.DEFAULT
```

#### Spacing
```typescript
// Consistent spacing scale
tokens.spacing.4.DEFAULT         // 1rem
tokens.spacing.8.DEFAULT         // 2rem
tokens.spacing.16.DEFAULT        // 4rem
```

#### Border Radius
```typescript
// Corner radius tokens
tokens.borderRadius.sm.DEFAULT   // Small radius
tokens.borderRadius.lg.DEFAULT   // Large radius
tokens.borderRadius.full.DEFAULT // Full radius
```

## 🎭 Theme System

### Available Themes

1. **Dark Theme** (Default)
   - High contrast, modern aesthetic
   - Optimized for low-light environments
   - Primary: Deep blues and grays

2. **Light Theme**
   - Clean, minimal design
   - Optimized for bright environments
   - Primary: Soft whites and grays

3. **Startup Theme**
   - Vibrant, energetic colors
   - Optimized for growth-focused applications
   - Primary: Bright blues and greens

4. **Enterprise Theme**
   - Professional, trustworthy colors
   - Optimized for business applications
   - Primary: Deep blues and navies

### Theme Switching

```typescript
import { useTheme } from '../providers/ThemeProvider';

const MyComponent = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  
  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value)}>
      {availableThemes.map(themeName => (
        <option key={themeName} value={themeName}>
          {themeName}
        </option>
      ))}
    </select>
  );
};
```

### Custom Themes

Create and apply custom themes through the Control Center:

```typescript
import { useDesignSystem } from '../hooks/useDesignSystem';

const { createCustomTheme, applyCustomThemeById } = useDesignSystem();

// Create a custom theme
const customTheme = {
  id: 'my-custom-theme',
  name: 'My Custom Theme',
  tokens: {
    'colors.primary.DEFAULT': '#FF6B6B',
    'colors.secondary.DEFAULT': '#4ECDC4',
    'spacing.4.DEFAULT': '1.5rem'
  }
};

createCustomTheme(customTheme);
applyCustomThemeById('my-custom-theme');
```

## 🛠️ Usage Guidelines

### ✅ Do's

1. **Use TypeScript Tokens**
   ```typescript
   // ✅ Good
   style={{ backgroundColor: tokens.colors.primary.DEFAULT }}
   
   // ❌ Bad
   style={{ backgroundColor: '#3B82F6' }}
   ```

2. **Use CSS Custom Properties**
   ```css
   /* ✅ Good */
   .my-component {
     background-color: hsl(var(--primary));
     padding: var(--spacing-4);
   }
   
   /* ❌ Bad */
   .my-component {
     background-color: #3B82F6;
     padding: 1rem;
   }
   ```

3. **Use Tailwind with CSS Variables**
   ```jsx
   // ✅ Good
   <div className="bg-primary text-primary-foreground p-4">
   
   // ❌ Bad
   <div className="bg-blue-500 text-white p-4">
   ```

4. **Create Semantic Components**
   ```typescript
   const Button = ({ variant = 'primary', children }) => (
     <button 
       className={`btn btn-${variant}`}
       style={{ 
         backgroundColor: tokens.colors[variant].DEFAULT,
         color: tokens.colors[variant].foreground 
       }}
     >
       {children}
     </button>
   );
   ```

### ❌ Don'ts

1. **Don't Use Hardcoded Values**
   ```typescript
   // ❌ Never do this
   style={{ color: '#FF0000', margin: '20px' }}
   ```

2. **Don't Create Inconsistent Spacing**
   ```typescript
   // ❌ Avoid arbitrary values
   style={{ padding: '17px', margin: '23px' }}
   ```

3. **Don't Mix Token Systems**
   ```typescript
   // ❌ Don't mix approaches
   style={{ 
     color: tokens.colors.primary.DEFAULT,
     padding: '1rem' // Should use tokens.spacing.4.DEFAULT
   }}
   ```

## 🎯 Component Patterns

### Button Components
```typescript
const Button = ({ variant = 'primary', size = 'md', children }) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors';
  
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
  };
  
  const sizeClasses = {
    sm: 'h-9 px-3 text-sm',
    md: 'h-10 px-4 py-2',
    lg: 'h-11 px-8'
  };
  
  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </button>
  );
};
```

### Card Components
```typescript
const Card = ({ children, className = '' }) => (
  <div 
    className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}
    style={{ 
      borderColor: tokens.colors.border.DEFAULT,
      backgroundColor: tokens.colors.background.secondary 
    }}
  >
    {children}
  </div>
);
```

## 🔧 Development Tools

### Control Center
Access the interactive design system management tool at `/control-center`:

- **Token Browser**: Explore all available tokens
- **Theme Editor**: Create and manage custom themes
- **Live Preview**: See changes in real-time
- **Export/Import**: Share configurations

### Validation Script
Run token validation to ensure compliance:

```bash
node scripts/validate-tokens.js
```

This script will:
- Detect hardcoded values
- Identify unused tokens
- Find missing token definitions
- Generate usage statistics

### ESLint Rules
Custom ESLint rules prevent hardcoded values:

```bash
yarn lint
```

Rules include:
- `no-hardcoded-colors`: Prevents hex/rgb color values
- `no-hardcoded-spacing`: Prevents arbitrary spacing values
- `no-hardcoded-typography`: Prevents hardcoded font sizes

## 📱 Responsive Design

### Breakpoint Tokens
```typescript
// Use Tailwind's responsive prefixes
<div className="p-4 md:p-6 lg:p-8">
  {/* Responsive padding using design tokens */}
</div>
```

### Mobile-First Approach
```typescript
// Start with mobile, enhance for larger screens
const Container = ({ children }) => (
  <div className="w-full px-4 md:px-6 lg:px-8 max-w-7xl mx-auto">
    {children}
  </div>
);
```

## 🎨 Color Accessibility

### Contrast Ratios
All color combinations meet WCAG 2.1 AA standards:

- **Normal Text**: 4.5:1 minimum contrast ratio
- **Large Text**: 3:1 minimum contrast ratio
- **UI Components**: 3:1 minimum contrast ratio

### Color Blindness Support
Our color system includes:

- **Semantic Indicators**: Icons and patterns alongside colors
- **High Contrast Mode**: Enhanced contrast for accessibility
- **Color Blind Safe**: Tested with color vision simulators

## 📊 Performance Considerations

### CSS Custom Properties
- **Runtime Updates**: Instant theme switching without page reload
- **Minimal Bundle Impact**: Tokens are CSS variables, not JavaScript
- **Caching**: Browser caches CSS, improving performance

### Token Optimization
- **Tree Shaking**: Unused tokens are removed in production
- **Lazy Loading**: Theme-specific tokens loaded on demand
- **Compression**: CSS variables compress well with gzip

## 🔄 Migration Guide

### From Hardcoded Values
1. **Identify**: Use validation script to find hardcoded values
2. **Replace**: Replace with appropriate design tokens
3. **Test**: Verify visual consistency
4. **Validate**: Run linting to ensure compliance

### From Old Theme System
1. **Update Imports**: Replace old theme imports with new tokens
2. **Update Components**: Use new token access patterns
3. **Test Themes**: Verify all themes work correctly
4. **Update Documentation**: Reflect new patterns

## 🚀 Best Practices

### Token Naming
- **Semantic Names**: Use purpose over appearance
- **Consistent Structure**: Follow `category.subcategory.variant` pattern
- **Clear Hierarchy**: Group related tokens together

### Component Design
- **Composable**: Build from smaller, reusable pieces
- **Configurable**: Accept theme-aware props
- **Accessible**: Include proper ARIA attributes

### Performance
- **Minimize Re-renders**: Use React.memo for expensive components
- **Optimize Bundles**: Tree-shake unused tokens
- **Cache Results**: Memoize token calculations

## 📚 Resources

- **Control Center**: `/control-center` - Interactive design system tool
- **Token Reference**: `src/theme/index.ts` - Complete token definitions
- **Theme Provider**: `src/providers/ThemeProvider.tsx` - Theme management
- **Validation Script**: `scripts/validate-tokens.js` - Token compliance checker
- **Example Components**: `src/components/examples/` - Usage examples

---

*This document is living and will be updated as the design system evolves. For questions or suggestions, please refer to the development team.*
