import { Variants } from 'framer-motion';

// Standardized animation durations
export const ANIMATION_DURATIONS = {
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
} as const;

// Standardized easing curves
export const ANIMATION_EASING = {
  easeOut: [0.0, 0.0, 0.2, 1],
  easeIn: [0.4, 0.0, 1, 1],
  easeInOut: [0.4, 0.0, 0.2, 1],
  sharp: [0.4, 0.0, 0.6, 1],
} as const;

// Standardized spring configurations
export const SPRING_CONFIG = {
  normal: {
    type: "spring" as const,
    stiffness: 300,
    damping: 30,
  },
  bouncy: {
    type: "spring" as const,
    stiffness: 400,
    damping: 25,
  },
  smooth: {
    type: "spring" as const,
    stiffness: 200,
    damping: 40,
  },
} as const;

// Fade in animation
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  exit: { 
    opacity: 0,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeIn,
    }
  },
};

// Slide up animation
export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeIn,
    }
  },
};

// Scale animation for buttons
export const buttonScale: Variants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  tap: { 
    scale: 0.95,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeOut,
    }
  },
};

// Card hover animation
export const cardHover: Variants = {
  initial: { 
    scale: 1,
    boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  },
  hover: { 
    scale: 1.02,
    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  tap: { 
    scale: 0.98,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeOut,
    }
  },
};

// Stagger animation for lists
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// List item animation
export const listItem: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeIn,
    }
  },
};

// Loading spinner animation
export const loadingSpinner: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

// Pulse animation for loading states
export const pulse: Variants = {
  initial: { opacity: 0.6 },
  animate: { 
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "reverse" as const,
    }
  },
};

// Slide in from right
export const slideInRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeIn,
    }
  },
};

// Scale in animation
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: ANIMATION_DURATIONS.normal,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeIn,
    }
  },
};

// Fade in up animation (legacy support)
export const fadeInUp: Variants = slideUp;

// Utility function to create consistent hover animations
export const createHoverAnimation = (scale: number = 1.05) => ({
  whileHover: { 
    scale,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeOut,
    }
  },
  whileTap: { 
    scale: 0.95,
    transition: {
      duration: ANIMATION_DURATIONS.fast,
      ease: ANIMATION_EASING.easeOut,
    }
  },
});

// Utility function to create consistent transition props
export const createTransitionProps = (duration: keyof typeof ANIMATION_DURATIONS = 'normal') => ({
  transition: {
    duration: ANIMATION_DURATIONS[duration],
    ease: ANIMATION_EASING.easeOut,
  },
});