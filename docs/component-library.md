# Component Library - Evolve Engine

## Overview

The Evolve Engine component library is built around the concept of "Liquid Glass" - a design system that emphasizes fluid interactions, transparency, and sophisticated visual effects. All components are designed to work together seamlessly while maintaining the premium feel of the platform.

## Core Components

### LiquidGlass

The signature component that embodies the fluid, responsive nature of our platform.

#### Basic Usage
```tsx
import { LiquidGlass } from '@/components/ui/liquid-glass';

<LiquidGlass className="p-6">
  <h2>Welcome to Evolve Engine</h2>
  <p>Transform your startup journey with AI-powered insights.</p>
</LiquidGlass>
```

#### Props Interface
```tsx
interface LiquidGlassProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  intensity?: number;           // 1-10 scale for liquid effect
  color?: string;              // Background color override
  borderRadius?: string;       // Border radius (default: 1rem)
  className?: string;
  disableHoverEffect?: boolean; // Disable hover animations
  bendFactor?: number;         // 0-1 scale for 3D bend effect
}
```

#### Intensity Examples
```tsx
// Low intensity - Background elements
<LiquidGlass intensity={2} className="p-4">
  <span>Subtle Background</span>
</LiquidGlass>

// Medium intensity - Interactive elements
<LiquidGlass intensity={5} className="p-6">
  <span>Interactive Panel</span>
</LiquidGlass>

// High intensity - Prominent features
<LiquidGlass intensity={8} className="p-8">
  <span>Hero Section</span>
</LiquidGlass>
```

#### Custom Colors
```tsx
// Primary brand color
<LiquidGlass 
  intensity={6}
  color="rgba(99, 102, 241, 0.1)"
  className="p-6"
>
  <span>Brand Element</span>
</LiquidGlass>

// Gradient background
<LiquidGlass 
  intensity={7}
  color="linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(239, 68, 68, 0.1) 100%)"
  className="p-6"
>
  <span>Motivation Card</span>
</LiquidGlass>
```

### LiquidCard

A structured variant of LiquidGlass with predefined variants and enhanced interactions.

#### Basic Usage
```tsx
import { LiquidCard } from '@/components/ui/liquid-card';

<LiquidCard className="p-6">
  <h3>Default Card</h3>
  <p>Standard information display.</p>
</LiquidCard>
```

#### Props Interface
```tsx
interface LiquidCardProps extends Omit<
  React.ComponentProps<typeof motion.div>,
  | 'onDrag'
  | 'onDragStart'
  | 'onDragEnd'
  | 'onDragCapture'
  | 'onDragStartCapture'
  | 'onDragEndCapture'
> {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning';
  hoverEffect?: 'lift' | 'glow' | 'both' | 'none';
  className?: string;
  borderGlow?: boolean;
  bendFactor?: number;
}
```

#### Variant Examples
```tsx
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

#### Hover Effect Variations
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

### GlassIconButton

Specialized circular button with water-drop styling and multiple light effects.

#### Basic Usage
```tsx
import { GlassIconButton } from '@/components/ui/glass-icon-button';

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

#### Props Interface
```tsx
interface GlassIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  ariaLabel: string;
  title?: string;
  disabled?: boolean;
  onClick?: () => void;
}
```

#### Visual Effects
The GlassIconButton includes multiple layered effects:
- **Droplet Specular Highlight**: Top-left white highlight
- **Vertical Light Streak**: Subtle light reflection
- **Inner Refraction Ring**: Cyan-tinted inner border
- **Concave Shadow**: Inset shadow for depth
- **Bottom Caustic**: Light pool effect
- **Ripple Animation**: Press feedback
- **Shimmer Effect**: Hover animation

#### Size Variations
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

### LiquidButton

Gradient-based button with liquid hover effects and 3D interactions.

#### Basic Usage
```tsx
import { LiquidButton } from '@/components/ui/liquid-button';

<LiquidButton variant="primary" size="md">
  Get Started
</LiquidButton>
```

#### Props Interface
```tsx
interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'motivation';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}
```

#### Variant Examples
```tsx
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

#### Size Variations
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

## Composite Components

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

## Component Patterns

### Card Layouts
```tsx
// Information Card
<LiquidCard variant="default" className="p-6">
  <div className="flex items-start space-x-4">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className="w-6 h-6 text-primary" />
      </div>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-lg font-semibold text-foreground">Card Title</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Card description with supporting text.
      </p>
    </div>
  </div>
</LiquidCard>

// Action Card
<LiquidCard variant="primary" className="p-6 cursor-pointer hover:shadow-glow">
  <div className="flex items-center justify-between">
    <div>
      <h3 className="text-lg font-semibold text-foreground">Action Required</h3>
      <p className="text-sm text-muted-foreground mt-1">
        Click to take action on this item.
      </p>
    </div>
    <GlassIconButton
      ariaLabel="Take action"
      title="Action"
    >
      <ArrowRight className="h-5 w-5" />
    </GlassIconButton>
  </div>
</LiquidCard>
```

### Form Elements
```tsx
// Form Container
<LiquidGlass intensity={3} className="p-6">
  <form className="space-y-4">
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        Email Address
      </label>
      <input
        type="email"
        className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
        placeholder="Enter your email"
      />
    </div>
    <LiquidButton variant="primary" size="md" className="w-full">
      Subscribe
    </LiquidButton>
  </form>
</LiquidGlass>
```

### Navigation Elements
```tsx
// Navigation Card
<LiquidCard variant="default" className="p-4 cursor-pointer">
  <div className="flex items-center space-x-3">
    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
      <Icon className="w-5 h-5 text-primary" />
    </div>
    <div className="flex-1">
      <h4 className="text-sm font-medium text-foreground">Navigation Item</h4>
      <p className="text-xs text-muted-foreground">Description</p>
    </div>
    <ArrowRight className="w-4 h-4 text-muted-foreground" />
  </div>
</LiquidCard>
```

## Best Practices

### Performance Optimization
1. **Use `disableHoverEffect={true}`** for static content
2. **Limit intensity levels** on mobile devices
3. **Avoid excessive nested glass components**
4. **Use CSS transforms** for animations
5. **Optimize for 60fps performance**

### Accessibility
1. **Include proper ARIA labels** for all interactive elements
2. **Provide focus indicators** for keyboard navigation
3. **Respect `prefers-reduced-motion`** user preference
4. **Ensure sufficient color contrast** ratios
5. **Use semantic HTML structure**

### Responsive Design
1. **Adapt intensity levels** for different screen sizes
2. **Adjust border radius** for mobile devices
3. **Optimize touch targets** for mobile interaction
4. **Consider performance** on lower-end devices

### Component Composition
1. **Combine components thoughtfully** to create complex layouts
2. **Maintain consistent spacing** using the design system
3. **Use appropriate variants** for different contexts
4. **Keep interactions intuitive** and predictable

---

*This component library provides the building blocks for creating beautiful, consistent user interfaces across the Evolve Engine platform.*
