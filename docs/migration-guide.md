# Design System Migration Guide

## Overview

This guide helps you migrate from hardcoded design values to our new type-safe design system. The migration ensures consistency, maintainability, and enables dynamic theming capabilities.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
yarn add glob
```

### 2. Run Validation
```bash
node scripts/validate-tokens.js
```

### 3. Fix Issues
Follow the recommendations in the validation report.

## 📋 Migration Checklist

### Phase 1: Assessment
- [ ] Run token validation script
- [ ] Review hardcoded values report
- [ ] Identify components needing updates
- [ ] Plan migration strategy

### Phase 2: Core Updates
- [ ] Update color values to use tokens
- [ ] Replace hardcoded spacing with tokens
- [ ] Update typography to use design system
- [ ] Test visual consistency

### Phase 3: Advanced Features
- [ ] Implement theme switching
- [ ] Add custom theme support
- [ ] Update documentation
- [ ] Train team members

### Phase 4: Validation
- [ ] Run validation script again
- [ ] Fix any remaining issues
- [ ] Test all themes
- [ ] Update brand guidelines

## 🔧 Step-by-Step Migration

### Step 1: Import Design Tokens

**Before:**
```typescript
// No imports needed for hardcoded values
const MyComponent = () => (
  <div style={{ backgroundColor: '#3B82F6', padding: '1rem' }}>
    Content
  </div>
);
```

**After:**
```typescript
import { tokens } from '../theme';

const MyComponent = () => (
  <div style={{ 
    backgroundColor: tokens.colors.primary.DEFAULT,
    padding: tokens.spacing.4.DEFAULT 
  }}>
    Content
  </div>
);
```

### Step 2: Replace Color Values

**Before:**
```typescript
// Hardcoded colors
const colors = {
  primary: '#3B82F6',
  secondary: '#EC4899',
  success: '#22C55E',
  error: '#EF4444'
};
```

**After:**
```typescript
import { tokens } from '../theme';

// Use design tokens
const colors = {
  primary: tokens.colors.primary.DEFAULT,
  secondary: tokens.colors.secondary.DEFAULT,
  success: tokens.colors.success.DEFAULT,
  error: tokens.colors.error.DEFAULT
};
```

### Step 3: Update Spacing Values

**Before:**
```typescript
// Hardcoded spacing
const styles = {
  padding: '16px',
  margin: '24px',
  gap: '8px'
};
```

**After:**
```typescript
import { tokens } from '../theme';

// Use spacing tokens
const styles = {
  padding: tokens.spacing.4.DEFAULT,  // 16px
  margin: tokens.spacing.6.DEFAULT,   // 24px
  gap: tokens.spacing.2.DEFAULT       // 8px
};
```

### Step 4: Update CSS Custom Properties

**Before:**
```css
.my-component {
  background-color: #3B82F6;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

**After:**
```css
.my-component {
  background-color: hsl(var(--primary));
  border-radius: var(--radius);
  box-shadow: var(--shadow-sm);
}
```

### Step 5: Implement Theme Switching

**Before:**
```typescript
// Static theme
const App = () => (
  <div className="dark-theme">
    <MyComponent />
  </div>
);
```

**After:**
```typescript
import { ThemeProvider } from '../providers/ThemeProvider';

const App = () => (
  <ThemeProvider defaultTheme="dark">
    <MyComponent />
  </div>
);
```

## 🎨 Component Migration Examples

### Button Component

**Before:**
```typescript
const Button = ({ variant = 'primary', children }) => {
  const styles = {
    primary: {
      backgroundColor: '#3B82F6',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '8px'
    },
    secondary: {
      backgroundColor: '#EC4899',
      color: '#FFFFFF',
      padding: '12px 24px',
      borderRadius: '8px'
    }
  };

  return (
    <button style={styles[variant]}>
      {children}
    </button>
  );
};
```

**After:**
```typescript
import { tokens } from '../theme';

const Button = ({ variant = 'primary', children }) => {
  const baseStyles = {
    padding: tokens.spacing.3.DEFAULT + ' ' + tokens.spacing.6.DEFAULT,
    borderRadius: tokens.borderRadius.md.DEFAULT,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  };

  const variantStyles = {
    primary: {
      backgroundColor: tokens.colors.primary.DEFAULT,
      color: tokens.colors.primary.foreground
    },
    secondary: {
      backgroundColor: tokens.colors.secondary.DEFAULT,
      color: tokens.colors.secondary.foreground
    }
  };

  return (
    <button style={{ ...baseStyles, ...variantStyles[variant] }}>
      {children}
    </button>
  );
};
```

### Card Component

**Before:**
```typescript
const Card = ({ children }) => (
  <div style={{
    backgroundColor: '#1E293B',
    border: '1px solid #334155',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  }}>
    {children}
  </div>
);
```

**After:**
```typescript
import { tokens } from '../theme';

const Card = ({ children }) => (
  <div style={{
    backgroundColor: tokens.colors.background.secondary,
    border: `1px solid ${tokens.colors.border.DEFAULT}`,
    borderRadius: tokens.borderRadius.lg.DEFAULT,
    padding: tokens.spacing.6.DEFAULT,
    boxShadow: tokens.shadows.md.DEFAULT
  }}>
    {children}
  </div>
);
```

## 🛠️ Common Migration Patterns

### Pattern 1: Color Migration

**Find:**
```typescript
// Hex colors
'#3B82F6', '#EC4899', '#22C55E', '#EF4444'

// RGB colors
'rgb(59, 130, 246)', 'rgba(236, 72, 153, 0.8)'

// HSL colors
'hsl(217, 91%, 60%)', 'hsla(328, 86%, 70%, 0.8)'
```

**Replace with:**
```typescript
// Design tokens
tokens.colors.primary.DEFAULT
tokens.colors.secondary.DEFAULT
tokens.colors.success.DEFAULT
tokens.colors.error.DEFAULT

// CSS custom properties
'hsl(var(--primary))'
'hsl(var(--secondary))'
'hsl(var(--success))'
'hsl(var(--error))'
```

### Pattern 2: Spacing Migration

**Find:**
```typescript
// Pixel values
'4px', '8px', '16px', '24px', '32px', '48px'

// Rem values
'0.25rem', '0.5rem', '1rem', '1.5rem', '2rem', '3rem'
```

**Replace with:**
```typescript
// Design tokens
tokens.spacing.1.DEFAULT  // 4px
tokens.spacing.2.DEFAULT  // 8px
tokens.spacing.4.DEFAULT  // 16px
tokens.spacing.6.DEFAULT  // 24px
tokens.spacing.8.DEFAULT  // 32px
tokens.spacing.12.DEFAULT // 48px

// CSS custom properties
'var(--spacing-1)'
'var(--spacing-2)'
'var(--spacing-4)'
'var(--spacing-6)'
'var(--spacing-8)'
'var(--spacing-12)'
```

### Pattern 3: Border Radius Migration

**Find:**
```typescript
// Hardcoded radius
'4px', '8px', '12px', '16px', '50%'
```

**Replace with:**
```typescript
// Design tokens
tokens.borderRadius.sm.DEFAULT  // 4px
tokens.borderRadius.md.DEFAULT  // 8px
tokens.borderRadius.lg.DEFAULT  // 12px
tokens.borderRadius.xl.DEFAULT  // 16px
tokens.borderRadius.full.DEFAULT // 50%

// CSS custom properties
'var(--radius-sm)'
'var(--radius-md)'
'var(--radius-lg)'
'var(--radius-xl)'
'var(--radius-full)'
```

## 🔍 Validation and Testing

### Automated Validation

Run the validation script to check for issues:

```bash
# Run validation
node scripts/validate-tokens.js

# Expected output:
# ✅ Used tokens: 45
# ❌ Unused tokens: 12
# ⚠️  Missing tokens: 0
# 🚨 Hardcoded values: 3
```

### Manual Testing

1. **Visual Regression Testing**
   - Compare before/after screenshots
   - Test all themes
   - Verify responsive behavior

2. **Theme Switching**
   - Test all available themes
   - Verify persistence
   - Check for visual glitches

3. **Performance Testing**
   - Measure bundle size impact
   - Test runtime performance
   - Verify caching behavior

### Common Issues and Solutions

#### Issue 1: TypeScript Errors
**Problem:** Type errors when using tokens
```typescript
// Error: Property 'primary' does not exist on type 'Colors'
tokens.colors.primary.DEFAULT
```

**Solution:** Ensure proper imports and type definitions
```typescript
import { tokens } from '../theme';
// Make sure src/theme/index.ts is properly exported
```

#### Issue 2: CSS Custom Properties Not Working
**Problem:** CSS variables not applying correctly
```css
/* Not working */
background-color: hsl(var(--primary));
```

**Solution:** Check CSS variable definitions
```css
/* Ensure variables are defined in :root */
:root {
  --primary: 231 48% 63%;
}
```

#### Issue 3: Theme Switching Not Working
**Problem:** Theme changes not applying
```typescript
// Theme not updating
setTheme('light');
```

**Solution:** Verify ThemeProvider setup
```typescript
// Ensure ThemeProvider wraps your app
<ThemeProvider defaultTheme="dark">
  <App />
</ThemeProvider>
```

## 📚 Resources and Tools

### Development Tools
- **Control Center**: `/control-center` - Interactive design system management
- **Validation Script**: `scripts/validate-tokens.js` - Automated compliance checking
- **ESLint Rules**: Custom rules for preventing hardcoded values

### Documentation
- **Brand Guidelines**: `docs/brand-guidelines.md` - Complete design system documentation
- **Token Reference**: `src/theme/index.ts` - All available tokens
- **Theme Provider**: `src/providers/ThemeProvider.tsx` - Theme management

### Example Components
- **Token Usage Example**: `src/components/examples/TokenUsageExample.tsx`
- **Theme Selector**: `src/components/ui/theme-selector.tsx`
- **Control Center**: `src/pages/ControlCenter.tsx`

## 🎯 Success Metrics

### Before Migration
- Hardcoded values throughout codebase
- Inconsistent design patterns
- Difficult theme switching
- Poor developer experience

### After Migration
- ✅ 100% token-based design values
- ✅ Consistent design patterns
- ✅ Dynamic theme switching
- ✅ Excellent developer experience
- ✅ Type-safe design system
- ✅ Automated validation
- ✅ Comprehensive documentation

## 🚨 Troubleshooting

### Common Problems

1. **Build Errors**
   ```bash
   # Check for missing imports
   yarn build
   
   # Fix TypeScript errors
   yarn type-check
   ```

2. **Runtime Errors**
   ```bash
   # Check browser console
   # Verify CSS custom properties are loaded
   ```

3. **Visual Issues**
   ```bash
   # Run validation script
   node scripts/validate-tokens.js
   
   # Check theme switching
   # Verify all themes work correctly
   ```

### Getting Help

1. **Check Documentation**: Review brand guidelines and examples
2. **Run Validation**: Use the validation script to identify issues
3. **Test Incrementally**: Migrate one component at a time
4. **Ask for Help**: Contact the development team for assistance

---

*This migration guide is a living document. Update it as you discover new patterns and solutions.*
