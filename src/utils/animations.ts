// Framer Motion animation variants for consistent animations throughout the app

export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.3, ease: "easeInOut" }
};

// Enhanced floating animations
export const floatingCard = {
  animate: {
    y: [0, -8, 0],
    rotate: [0, 0.5, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1]
    }
  },
  hover: {
    scale: 1.05,
    y: -12,
    rotate: 1,
    boxShadow: "0 25px 50px -12px hsl(var(--primary) / 0.25)",
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  }
};

export const cardHover = {
  hover: {
    scale: 1.02,
    y: -4,
    boxShadow: "0 20px 40px -12px rgba(99, 102, 241, 0.25)",
    transition: { duration: 0.2, ease: "easeOut" }
  }
};

export const taskComplete = {
  initial: { scale: 1 },
  animate: { 
    scale: [1, 1.1, 1],
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

export const progressBar = {
  initial: { width: 0 },
  animate: (progress: number) => ({
    width: `${progress}%`,
    transition: { duration: 1, ease: "easeOut" }
  })
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export const bounceIn = {
  initial: { opacity: 0, scale: 0.3 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

// Floating background elements
export const floatingElement = {
  animate: {
    y: [0, -20, 0],
    x: [0, 10, 0],
    rotate: [0, 5, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 8,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

export const floatingElementReverse = {
  animate: {
    y: [0, 15, 0],
    x: [0, -8, 0],
    rotate: [0, -3, 0],
    scale: [1, 0.9, 1],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1],
      delay: 2
    }
  }
};

// Enhanced motivation card animations
export const pulsatingGlow = {
  animate: {
    boxShadow: [
      "0 0 20px hsl(var(--primary) / 0.3)",
      "0 0 40px hsl(var(--primary) / 0.5)", 
      "0 0 20px hsl(var(--primary) / 0.3)"
    ],
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Floating icon animations
export const floatingIcon = {
  animate: {
    y: [0, -10, 0],
    rotate: [0, 10, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};

// Alive breathing animation for containers
export const breathingContainer = {
  animate: {
    scale: [1, 1.01, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: [0.4, 0, 0.2, 1]
    }
  }
};