# Brand Guidelines - Evolve Engine

## Brand Identity

### Mission
Transforming startup dreams into reality through AI-powered task management, motivation tracking, and intelligent progress visualization.

### Brand Values
- **Innovation**: Cutting-edge technology with human-centered design
- **Fluidity**: Seamless, adaptive experiences that flow naturally
- **Motivation**: Empowering users to achieve their goals
- **Sophistication**: Premium, polished design with attention to detail
- **Accessibility**: Intuitive and inclusive for all users

## Color Palette

### Primary Colors
- **Indigo Primary**: `#6366F1` (Primary brand color)
- **Indigo Dark**: `#4F46E5` (Deep, trustworthy tone)
- **Deep Slate**: `#0F172A` (Rich background foundation)

### Secondary Colors
- **Motivation Pink**: `#EC4899` (Energy, drive, passion)
- **Success Green**: `#22C55E` (Progress, achievement, growth)
- **Warning Amber**: `#F59E0B` (Alerts, deadlines, attention)

### Accent Colors
- **Danger Red**: `#EF4444` (Errors, overdue items)
- **Info Cyan**: `#06B6D4` (Information, notifications)
- **Purple Accent**: `#8B5CF6` (Innovation, technology)

### Neutral Colors
- **Text Primary**: `#F1F5F9` (Primary text on dark)
- **Text Secondary**: `#94A3B8` (Secondary text)
- **Text Muted**: `#64748B` (Tertiary text)
- **Background**: `#0F172A` (Main background)
- **Surface**: `#1E293B` (Card backgrounds)
- **Surface Light**: `#334155` (Elevated surfaces)
- **Border**: `#334155` (Subtle borders)

## CSS Custom Properties

### Dark Theme Variables
```css
:root {
  /* Main backgrounds - Modern dark theme */
  --background: 220 13% 6%;        /* Deep slate #0F172A */
  --foreground: 210 20% 95%;       /* Text primary #F1F5F9 */
  --surface: 217 19% 12%;          /* Surface #1E293B */
  --surface-light: 215 16% 17%;    /* Surface light #334155 */

  /* Card backgrounds */
  --card: 217 19% 12%;             /* Card background */
  --card-foreground: 210 20% 95%;  /* Card text */

  /* Popover backgrounds */
  --popover: 217 19% 12%;          /* Popover background */
  --popover-foreground: 210 20% 95%; /* Popover text */

  /* Primary - Indigo brand color */
  --primary: 231 48% 63%;          /* Indigo Primary #6366F1 */
  --primary-dark: 232 54% 56%;     /* Indigo Dark #4F46E5 */
  --primary-foreground: 210 20% 95%; /* White text on primary */

  /* Secondary - Pink accent for motivation */
  --secondary: 328 86% 70%;        /* Motivation Pink #EC4899 */
  --secondary-foreground: 210 20% 95%; /* White text */

  /* Success - Green for completed items */
  --success: 158 64% 52%;          /* Success Green #22C55E */
  --success-foreground: 210 20% 95%; /* White text */

  /* Warning - Amber for deadlines */
  --warning: 43 96% 56%;           /* Warning Amber #F59E0B */
  --warning-foreground: 220 13% 6%; /* Dark text on warning */

  /* Danger - Red for overdue items */
  --danger: 0 84% 60%;             /* Danger Red #EF4444 */
  --danger-foreground: 210 20% 95%; /* White text */

  /* Text colors */
  --text-primary: 210 20% 95%;     /* Text primary #F1F5F9 */
  --text-secondary: 215 16% 65%;   /* Text secondary #94A3B8 */
  --text-muted: 215 20% 45%;       /* Text muted #64748B */

  /* Muted backgrounds */
  --muted: 215 16% 17%;            /* Muted background */
  --muted-foreground: 215 16% 65%; /* Muted text */

  /* Accent backgrounds */
  --accent: 215 16% 17%;           /* Accent background */
  --accent-foreground: 210 20% 95%; /* Accent text */

  /* Destructive */
  --destructive: 0 84% 60%;        /* Danger Red #EF4444 */
  --destructive-foreground: 210 20% 95%; /* White text */

  /* Borders and inputs */
  --border: 215 16% 17%;           /* Border #334155 */
  --input: 215 16% 17%;            /* Input borders */
  --ring: 231 48% 63%;             /* Focus rings */

  /* Gradients for beautiful effects */
  --gradient-primary: linear-gradient(135deg, hsl(231 48% 63%) 0%, hsl(250 84% 70%) 100%);
  --gradient-success: linear-gradient(135deg, hsl(158 64% 52%) 0%, hsl(158 84% 45%) 100%);
  --gradient-motivation: linear-gradient(135deg, hsl(328 86% 70%) 0%, hsl(347 77% 65%) 100%);
  --gradient-warning: linear-gradient(135deg, hsl(43 96% 56%) 0%, hsl(38 92% 50%) 100%);
  --gradient-subtle: linear-gradient(180deg, hsl(217 19% 12%) 0%, hsl(220 13% 9%) 100%);

  /* Shadows with primary color */
  --shadow-elegant: 0 10px 30px -10px hsl(231 48% 63% / 0.3);
  --shadow-glow: 0 0 40px hsl(231 48% 70% / 0.4);
  --shadow-card: 0 4px 16px -4px hsl(217 19% 8% / 0.4);

  /* Animation variables */
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-spring: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  /* Border radius */
  --radius: 0.75rem;
}
```

## Typography

### Font Hierarchy
- **Headings**: Inter, system-ui, sans-serif
- **Body Text**: Inter, system-ui, sans-serif
- **Code/Monospace**: JetBrains Mono, Consolas, monospace

### Scale
- **Hero (H1)**: 3.5rem (56px) - Landing pages
- **Title (H2)**: 2.25rem (36px) - Page titles
- **Heading (H3)**: 1.875rem (30px) - Section headers
- **Subheading (H4)**: 1.5rem (24px) - Component titles
- **Body Large**: 1.125rem (18px) - Important text
- **Body**: 1rem (16px) - Default text
- **Body Small**: 0.875rem (14px) - Secondary text
- **Caption**: 0.75rem (12px) - Labels, captions

### Text Gradients
```css
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

## Spacing & Layout

### Spacing Scale (Tailwind-based)
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Component Spacing
- **Button padding**: 0.75rem 1.5rem (12px 24px)
- **Card padding**: 1.5rem (24px)
- **Form spacing**: 1rem (16px) between fields
- **Section spacing**: 3rem (48px) between major sections

## Glass Components

### LiquidGlass Component
The signature design element embodying fluid, responsive interactions.

#### Props
- **intensity**: `number` (1-10) - Liquid effect intensity
- **color**: `string` - Background color override
- **borderRadius**: `string` - Border radius (default: 1rem)
- **disableHoverEffect**: `boolean` - Disable hover animations
- **bendFactor**: `number` (0-1) - 3D bend intensity

#### Usage Guidelines
```tsx
<LiquidGlass
  intensity={5}                    // 1-10 scale for liquid effect
  color="rgba(255, 255, 255, 0.1)" // Optional color override
  borderRadius="1rem"              // Consistent with design system
  disableHoverEffect={false}       // Enable/disable hover animations
  bendFactor={0.5}                 // 0-1 scale for 3D bend effect
>
  {/* Content */}
</LiquidGlass>
```

### LiquidCard Component
Structured variant with predefined variants and enhanced interactions.

#### Props
- **variant**: `'default' | 'primary' | 'secondary' | 'success' | 'warning'`
- **hoverEffect**: `'lift' | 'glow' | 'both' | 'none'`
- **borderGlow**: `boolean` - Enable border highlight
- **bendFactor**: `number` (0-1) - 3D bend intensity

### GlassIconButton Component
Specialized circular button with water-drop styling and multiple light effects.

#### Visual Effects
- **Droplet Specular Highlight**: Top-left white highlight
- **Vertical Light Streak**: Subtle light reflection
- **Inner Refraction Ring**: Cyan-tinted inner border
- **Concave Shadow**: Inset shadow for depth
- **Bottom Caustic**: Light pool effect
- **Ripple Animation**: Press feedback
- **Shimmer Effect**: Hover animation

## Gradients

### Primary Gradients
- **Primary Gradient**: `linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)`
- **Motivation Gradient**: `linear-gradient(135deg, #EC4899 0%, #EF4444 100%)`
- **Success Gradient**: `linear-gradient(135deg, #22C55E 0%, #16A34A 100%)`
- **Warning Gradient**: `linear-gradient(135deg, #F59E0B 0%, #D97706 100%)`
- **Subtle Gradient**: `linear-gradient(180deg, #1E293B 0%, #0F172A 100%)`

## Shadows & Depth

### Shadow System
- **Elegant Shadow**: `0 10px 30px -10px hsl(231 48% 63% / 0.3)`
- **Glow Shadow**: `0 0 40px hsl(231 48% 70% / 0.4)`
- **Card Shadow**: `0 4px 16px -4px hsl(217 19% 8% / 0.4)`

### Usage Guidelines
- **shadow-elegant**: Primary interactive elements
- **shadow-glow**: Hover states and important actions
- **shadow-card**: Background cards and containers

## Animation & Interactions

### Transition System
- **Smooth transitions**: `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- **Spring transitions**: `all 0.4s cubic-bezier(0.23, 1, 0.32, 1)`

### Animation Principles
1. **Fluid Motion**: All animations should feel natural and smooth
2. **Responsive Feedback**: Immediate visual feedback for user actions
3. **Layered Effects**: Multiple subtle animations working together
4. **Performance First**: Optimize for 60fps animations

### Hover Effects
```css
.hover-scale {
  @apply transition-all duration-200 hover:scale-105;
}

.hover-glow {
  @apply transition-all duration-300 hover:shadow-glow;
}
```

## Component Guidelines

### When to Use Each Component

#### LiquidGlass
- **Hero sections** and main content areas
- **Background containers** for important content
- **Interactive panels** that need fluid effects
- **Modal overlays** and dialogs

#### LiquidCard
- **Dashboard cards** and information displays
- **Feature showcases** and product highlights
- **Interactive content** with structured layouts
- **Status indicators** and progress displays

#### GlassIconButton
- **Primary actions** and navigation
- **Floating action buttons** (FAB)
- **Tool controls** and settings
- **Quick access** buttons

### Intensity Guidelines
- **Low (1-3)**: Subtle effects for background elements
- **Medium (4-6)**: Standard interactive elements
- **High (7-8)**: Prominent features and call-to-actions
- **Maximum (9-10)**: Hero sections and key interactions

## Usage Examples

### Do's ✅
- Use indigo primary as the main brand color
- Apply liquid glass effects for premium interactions
- Use motivation pink for encouraging and energizing elements
- Maintain consistent spacing using the defined scale
- Use success green for achievements and positive feedback
- Keep the dark theme foundation for sophistication

### Don'ts ❌
- Don't mix random colors outside the palette
- Don't overuse glass effects - they should enhance, not distract
- Don't reduce contrast below WCAG AA standards
- Don't use more than 3-4 colors in a single component
- Don't ignore the spacing scale
- Don't use harsh, bright colors that feel unprofessional

## Accessibility

### Color Contrast
- **Primary text**: Minimum 4.5:1 contrast ratio
- **Large text**: Minimum 3:1 contrast ratio
- **Interactive elements**: Clear focus indicators
- **Error states**: Not relying on color alone

### Focus States
- **Focus ring**: 2px solid primary color with offset
- **Interactive elements**: Clear hover and active states
- **Keyboard navigation**: Visible focus indicators
- **Reduced motion**: Respect user's motion preferences

### Screen Reader Support
- **ARIA labels**: Proper labels for all interactive elements
- **Semantic HTML**: Use appropriate HTML elements
- **Alternative text**: Provide text alternatives for visual content

## Implementation

All colors are implemented as CSS custom properties and available in the Tailwind configuration. Use semantic color names (primary, secondary, etc.) rather than specific color values to maintain consistency and enable theme switching.

### CSS Utility Classes
```css
/* Glass Effects */
.glass                    /* Basic glass morphism */
.liquid-glass            /* Liquid glass effect */
.liquid-glass:hover      /* Hover state */

/* Gradients */
.bg-gradient-primary      /* Primary background gradient */
.bg-gradient-motivation  /* Motivation background gradient */
.text-gradient-primary   /* Primary text gradient */

/* Shadows */
.shadow-elegant          /* Elegant shadow */
.shadow-glow             /* Glow shadow */
.shadow-card             /* Card shadow */

/* Animations */
.transition-smooth       /* Smooth transitions */
.transition-spring       /* Spring transitions */
.hover-scale             /* Scale on hover */
.hover-glow              /* Glow on hover */
```

---

*This brand guide is a living document that should be updated as the Evolve Engine platform evolves. All team members should reference this guide to maintain consistency across the product experience.*
