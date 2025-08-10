# Quick Reference Guide - Evolve Engine Glass Components

## Component Imports

```tsx
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { LiquidCard } from '@/components/ui/liquid-card';
import { GlassIconButton } from '@/components/ui/glass-icon-button';
import { LiquidButton } from '@/components/ui/liquid-button';
```

## LiquidGlass Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `intensity` | `number` | `5` | Liquid effect intensity (1-10) |
| `color` | `string` | `rgba(255, 255, 255, 0.1)` | Background color override |
| `borderRadius` | `string` | `1rem` | Border radius |
| `disableHoverEffect` | `boolean` | `false` | Disable hover animations |
| `bendFactor` | `number` | `0.5` | 3D bend intensity (0-1) |

## LiquidCard Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'primary' \| 'secondary' \| 'success' \| 'warning'` | `'default'` | Visual variant |
| `hoverEffect` | `'lift' \| 'glow' \| 'both' \| 'none'` | `'both'` | Hover animation type |
| `borderGlow` | `boolean` | `true` | Enable border highlight |
| `bendFactor` | `number` | `0.5` | 3D bend intensity (0-1) |

## GlassIconButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ariaLabel` | `string` | - | Accessibility label (required) |
| `title` | `string` | - | Tooltip text |
| `disabled` | `boolean` | `false` | Disable button |
| `onClick` | `function` | - | Click handler |

## LiquidButton Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'primary' \| 'success' \| 'warning' \| 'motivation'` | `'primary'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Button size |

## Color Variables

```css
/* Primary Colors */
--primary: 231 48% 63%;          /* Indigo 500 */
--secondary: 328 86% 70%;        /* Pink 400 */
--success: 158 64% 52%;          /* Green 500 */
--warning: 43 96% 56%;           /* Amber 400 */
--danger: 0 84% 60%;             /* Red 500 */

/* Backgrounds */
--background: 220 13% 6%;        /* Deep slate */
--surface: 217 19% 12%;          /* Card backgrounds */
--card: 217 19% 12%;             /* Card containers */
```

## Gradient Variables

```css
--gradient-primary: linear-gradient(135deg, hsl(231 48% 63%) 0%, hsl(250 84% 70%) 100%);
--gradient-motivation: linear-gradient(135deg, hsl(328 86% 70%) 0%, hsl(347 77% 65%) 100%);
--gradient-success: linear-gradient(135deg, hsl(158 64% 52%) 0%, hsl(158 84% 45%) 100%);
--gradient-warning: linear-gradient(135deg, hsl(43 96% 56%) 0%, hsl(38 92% 50%) 100%);
```

## Shadow Variables

```css
--shadow-elegant: 0 10px 30px -10px hsl(231 48% 63% / 0.3);
--shadow-glow: 0 0 40px hsl(231 48% 70% / 0.4);
--shadow-card: 0 4px 16px -4px hsl(217 19% 8% / 0.4);
```

## CSS Utility Classes

### Glass Effects
```css
.glass                    /* Basic glass morphism */
.liquid-glass            /* Liquid glass effect */
.liquid-glass:hover      /* Hover state */
```

### Gradients
```css
.bg-gradient-primary      /* Primary background gradient */
.bg-gradient-motivation  /* Motivation background gradient */
.bg-gradient-success     /* Success background gradient */
.bg-gradient-warning     /* Warning background gradient */
.text-gradient-primary   /* Primary text gradient */
.text-gradient-motivation /* Motivation text gradient */
```

### Shadows
```css
.shadow-elegant          /* Elegant shadow */
.shadow-glow             /* Glow shadow */
.shadow-card             /* Card shadow */
```

### Animations
```css
.transition-smooth       /* Smooth transitions */
.transition-spring       /* Spring transitions */
.hover-scale             /* Scale on hover */
.hover-glow              /* Glow on hover */
```

## Common Patterns

### Hero Section
```tsx
<LiquidGlass intensity={8} borderRadius="1.5rem" className="p-8" disableHoverEffect={true}>
  <h1 className="text-4xl font-bold text-gradient-primary">Title</h1>
  <p className="text-text-secondary">Description</p>
</LiquidGlass>
```

### Stats Card
```tsx
<LiquidCard variant="primary" className="p-4">
  <div className="text-center">
    <h3 className="text-2xl font-bold text-gradient-primary">24</h3>
    <p className="text-sm text-muted-foreground">Label</p>
  </div>
</LiquidCard>
```

### Action Button
```tsx
<LiquidButton variant="primary" size="lg">
  Action Text
</LiquidButton>
```

### Icon Button
```tsx
<GlassIconButton ariaLabel="Action description" title="Action">
  <Icon className="h-5 w-5" />
</GlassIconButton>
```

## Intensity Guidelines

| Level | Use Case | Example |
|-------|----------|---------|
| 1-3 | Background elements | Subtle containers |
| 4-6 | Standard interactions | Cards, panels |
| 7-8 | Prominent features | Hero sections, CTAs |
| 9-10 | Key interactions | Main actions, modals |

## Variant Usage

| Variant | Use Case | Semantic Meaning |
|---------|----------|------------------|
| `default` | General content | Neutral information |
| `primary` | Brand elements | Main actions, brand identity |
| `secondary` | Supporting content | Secondary information |
| `success` | Positive feedback | Achievements, completions |
| `warning` | Alerts | Deadlines, important notices |

## Accessibility Checklist

- [ ] Include `ariaLabel` for GlassIconButton
- [ ] Provide focus indicators
- [ ] Test with screen readers
- [ ] Respect `prefers-reduced-motion`
- [ ] Ensure color contrast ratios
- [ ] Use semantic HTML structure

## Performance Tips

- Use `disableHoverEffect={true}` for static content
- Limit intensity levels on mobile devices
- Avoid excessive nested glass components
- Use CSS transforms for animations
- Optimize for 60fps performance

## Common Issues

### Glass Effect Not Visible
- Check background color contrast
- Ensure backdrop-blur is supported
- Verify z-index layering

### Animations Not Smooth
- Use CSS transforms instead of layout properties
- Check for conflicting animations
- Verify hardware acceleration

### Mobile Performance
- Reduce intensity levels
- Disable hover effects on touch devices
- Use simpler animations

---

*This quick reference should help you implement glass components consistently across the Evolve Engine platform.*
