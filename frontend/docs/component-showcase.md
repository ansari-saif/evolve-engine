# Component Showcase - Evolve Engine

This document showcases the key glass components in the Evolve Engine design system with practical usage examples.

## LiquidGlass Component Showcase

### Basic Usage

```tsx
import { LiquidGlass } from '@/components/ui/liquid-glass';

// Simple container with default settings
<LiquidGlass className="p-6">
  <h2>Welcome to Evolve Engine</h2>
  <p>Transform your startup journey with AI-powered insights.</p>
</LiquidGlass>
```

### Intensity Variations

```tsx
// Low intensity - Subtle background effect
<LiquidGlass intensity={2} className="p-4">
  <span>Background Element</span>
</LiquidGlass>

// Medium intensity - Standard interactive element
<LiquidGlass intensity={5} className="p-6">
  <span>Interactive Panel</span>
</LiquidGlass>

// High intensity - Prominent feature
<LiquidGlass intensity={8} className="p-8">
  <span>Hero Section</span>
</LiquidGlass>
```

### Custom Colors

```tsx
// Primary brand color
<LiquidGlass 
  intensity={6}
  color="rgba(99, 102, 241, 0.1)"
  className="p-6"
>
  <span>Primary Brand Element</span>
</LiquidGlass>

// Motivation gradient background
<LiquidGlass 
  intensity={7}
  color="linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)"
  className="p-6"
>
  <span>Motivation Card</span>
</LiquidGlass>
```

### Disabled Hover Effects

```tsx
// Static container without hover animations
<LiquidGlass 
  intensity={4}
  disableHoverEffect={true}
  className="p-6"
>
  <span>Static Content</span>
</LiquidGlass>
```

## LiquidCard Component Showcase

### Variant Examples

```tsx
import { LiquidCard } from '@/components/ui/liquid-card';

// Default variant
<LiquidCard className="p-6">
  <h3>Default Card</h3>
  <p>Standard information display.</p>
</LiquidCard>

// Primary variant
<LiquidCard variant="primary" className="p-6">
  <h3>Primary Card</h3>
  <p>Important information with brand colors.</p>
</LiquidCard>

// Success variant
<LiquidCard variant="success" className="p-6">
  <h3>Success Card</h3>
  <p>Positive feedback and achievements.</p>
</LiquidCard>

// Warning variant
<LiquidCard variant="warning" className="p-6">
  <h3>Warning Card</h3>
  <p>Important alerts and deadlines.</p>
</LiquidCard>
```

### Hover Effect Variations

```tsx
// Lift effect only
<LiquidCard hoverEffect="lift" className="p-6">
  <span>Lift on Hover</span>
</LiquidCard>

// Glow effect only
<LiquidCard hoverEffect="glow" className="p-6">
  <span>Glow on Hover</span>
</LiquidCard>

// Both effects
<LiquidCard hoverEffect="both" className="p-6">
  <span>Lift + Glow</span>
</LiquidCard>

// No hover effects
<LiquidCard hoverEffect="none" className="p-6">
  <span>Static Card</span>
</LiquidCard>
```

### Border Glow Control

```tsx
// With border glow
<LiquidCard borderGlow={true} className="p-6">
  <span>Glowing Border</span>
</LiquidCard>

// Without border glow
<LiquidCard borderGlow={false} className="p-6">
  <span>No Border Glow</span>
</LiquidCard>
```

## GlassIconButton Component Showcase

### Basic Usage

```tsx
import { GlassIconButton } from '@/components/ui/glass-icon-button';

// Simple icon button
<GlassIconButton
  onClick={() => console.log('Clicked!')}
  ariaLabel="Send message"
  title="Send"
>
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
  </svg>
</GlassIconButton>
```

### Disabled State

```tsx
<GlassIconButton
  disabled={true}
  ariaLabel="Disabled action"
  title="Disabled"
>
  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
  </svg>
</GlassIconButton>
```

### Different Sizes (via className)

```tsx
// Small button
<GlassIconButton
  className="h-8 w-8"
  ariaLabel="Small action"
>
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
</GlassIconButton>

// Large button
<GlassIconButton
  className="h-16 w-16"
  ariaLabel="Large action"
>
  <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
</GlassIconButton>
```

## LiquidButton Component Showcase

### Variant Examples

```tsx
import { LiquidButton } from '@/components/ui/liquid-button';

// Primary button
<LiquidButton variant="primary" size="md">
  Get Started
</LiquidButton>

// Success button
<LiquidButton variant="success" size="md">
  Complete Task
</LiquidButton>

// Warning button
<LiquidButton variant="warning" size="md">
  Set Deadline
</LiquidButton>

// Motivation button
<LiquidButton variant="motivation" size="md">
  Stay Motivated
</LiquidButton>
```

### Size Variations

```tsx
// Small button
<LiquidButton variant="primary" size="sm">
  Small Action
</LiquidButton>

// Medium button (default)
<LiquidButton variant="primary" size="md">
  Medium Action
</LiquidButton>

// Large button
<LiquidButton variant="primary" size="lg">
  Large Action
</LiquidButton>
```

### With Icons

```tsx
<LiquidButton variant="primary" size="md">
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
  </svg>
  Button with Icon
</LiquidButton>
```

## Real-World Usage Examples

### Dashboard Hero Section

```tsx
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { LiquidButton } from '@/components/ui/liquid-button';

<LiquidGlass 
  intensity={8}
  borderRadius="1.5rem"
  className="p-8 mb-6"
  disableHoverEffect={true}
>
  <div className="mb-6">
    <h1 className="text-4xl font-bold text-gradient-primary mb-2">
      Your Startup Journey
    </h1>
    <p className="text-text-secondary text-lg">
      Transform your dreams into reality, one day at a time.
    </p>
  </div>
  <div className="flex gap-4">
    <LiquidButton variant="primary" size="lg">
      Start New Task
    </LiquidButton>
    <LiquidButton variant="motivation" size="lg">
      View Progress
    </LiquidButton>
  </div>
</LiquidGlass>
```

### Motivation Card

```tsx
import { LiquidGlass } from '@/components/ui/liquid-glass';
import { motion } from 'framer-motion';

<LiquidGlass
  intensity={8}
  color="linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)"
  className="p-6 text-white relative cursor-pointer"
>
  <motion.div
    animate={{ 
      rotate: 360,
      scale: [1, 1.1, 1]
    }}
    transition={{ 
      rotate: { duration: 20, repeat: Infinity, ease: "linear" },
      scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
    className="absolute -top-4 -right-4 w-16 h-16 opacity-20"
  >
    <Heart className="w-16 h-16" />
  </motion.div>
  
  <div className="relative z-10">
    <h3 className="text-xl font-semibold mb-2">Stay Motivated</h3>
    <p className="text-white/80">
      Every step forward is progress toward your goals.
    </p>
  </div>
</LiquidGlass>
```

### Chat Interface

```tsx
import { GlassIconButton } from '@/components/ui/glass-icon-button';

<div className="flex items-end gap-2">
  <textarea
    placeholder="Send a message…"
    rows={2}
    className="flex-1 resize-none rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
  />
  <GlassIconButton
    onClick={sendMessage}
    ariaLabel="Send message"
    title="Send"
    disabled={!canSend}
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M2.01 21 23 12 2.01 3 2 10l15 2-15 2 .01 7z" />
    </svg>
  </GlassIconButton>
</div>
```

### Stats Card Grid

```tsx
import { LiquidCard } from '@/components/ui/liquid-card';

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <LiquidCard variant="primary" className="p-4">
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gradient-primary">24</h3>
      <p className="text-sm text-muted-foreground">Tasks Completed</p>
    </div>
  </LiquidCard>
  
  <LiquidCard variant="success" className="p-4">
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gradient-success">85%</h3>
      <p className="text-sm text-muted-foreground">Success Rate</p>
    </div>
  </LiquidCard>
  
  <LiquidCard variant="motivation" className="p-4">
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gradient-motivation">12</h3>
      <p className="text-sm text-muted-foreground">Days Streak</p>
    </div>
  </LiquidCard>
  
  <LiquidCard variant="warning" className="p-4">
    <div className="text-center">
      <h3 className="text-2xl font-bold text-gradient-warning">3</h3>
      <p className="text-sm text-muted-foreground">Pending Tasks</p>
    </div>
  </LiquidCard>
</div>
```

## CSS Utility Classes

### Glass Effects

```css
/* Basic glass morphism */
.glass {
  @apply bg-card/80 backdrop-blur-xl border border-border/50;
}

/* Liquid glass effect */
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

### Gradients

```css
/* Background gradients */
.bg-gradient-primary {
  background: var(--gradient-primary);
}

.bg-gradient-motivation {
  background: var(--gradient-motivation);
}

.bg-gradient-success {
  background: var(--gradient-success);
}

.bg-gradient-warning {
  background: var(--gradient-warning);
}

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

### Shadows

```css
/* Shadow utilities */
.shadow-elegant {
  box-shadow: var(--shadow-elegant);
}

.shadow-glow {
  box-shadow: var(--shadow-glow);
}

.shadow-card {
  box-shadow: var(--shadow-card);
}
```

### Animations

```css
/* Transition utilities */
.transition-smooth {
  transition: var(--transition-smooth);
}

.transition-spring {
  transition: var(--transition-spring);
}

/* Hover effects */
.hover-scale {
  @apply transition-all duration-200 hover:scale-105;
}

.hover-glow {
  @apply transition-all duration-300 hover:shadow-glow;
}
```

## Best Practices

### Performance Optimization

1. **Use CSS transforms** instead of changing layout properties
2. **Limit animation complexity** on mobile devices
3. **Use `will-change`** sparingly and only when needed
4. **Optimize for 60fps** animations

### Accessibility

1. **Provide focus indicators** for all interactive elements
2. **Respect `prefers-reduced-motion`** user preference
3. **Ensure sufficient color contrast** ratios
4. **Include proper ARIA labels** for screen readers

### Responsive Design

1. **Adapt intensity levels** for different screen sizes
2. **Adjust border radius** for mobile devices
3. **Optimize touch targets** for mobile interaction
4. **Consider performance** on lower-end devices

---

*This showcase demonstrates the versatility and power of the Evolve Engine glass component system. Use these examples as a foundation for building consistent, beautiful user interfaces.*
