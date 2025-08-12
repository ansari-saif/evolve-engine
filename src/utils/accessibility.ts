// Accessibility utilities for WCAG AA compliance

// Focus management utilities
export const focusManagement = {
  // Trap focus within a container
  trapFocus: (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  },

  // Move focus to next focusable element
  focusNext: (currentElement: HTMLElement) => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(currentElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    
    focusableElements[nextIndex]?.focus();
  },

  // Move focus to previous focusable element
  focusPrevious: (currentElement: HTMLElement) => {
    const focusableElements = Array.from(
      document.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const currentIndex = focusableElements.indexOf(currentElement);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    
    focusableElements[previousIndex]?.focus();
  },

  // Store and restore focus
  storeFocus: () => {
    const activeElement = document.activeElement as HTMLElement;
    return () => {
      activeElement?.focus();
    };
  },
};

// Screen reader utilities
export const screenReader = {
  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Create accessible button
  createAccessibleButton: (
    onClick: () => void,
    label: string,
    description?: string
  ) => ({
    onClick,
    'aria-label': label,
    'aria-describedby': description ? `${label}-description` : undefined,
    role: 'button',
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick();
      }
    },
  }),

  // Create accessible dialog
  createAccessibleDialog: (title: string, description?: string) => ({
    role: 'dialog',
    'aria-modal': true,
    'aria-labelledby': `${title}-title`,
    'aria-describedby': description ? `${title}-description` : undefined,
  }),
};

// Color contrast utilities
export const colorContrast = {
  // Calculate relative luminance
  getRelativeLuminance: (r: number, g: number, b: number): number => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  },

  // Calculate contrast ratio
  getContrastRatio: (l1: number, l2: number): number => {
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  },

  // Check if contrast meets WCAG AA standards
  meetsWCAGAA: (contrastRatio: number, isLargeText: boolean = false): boolean => {
    return isLargeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
  },
};

// Keyboard navigation utilities
export const keyboardNavigation = {
  // Handle arrow key navigation
  handleArrowKeys: (
    e: React.KeyboardEvent,
    onUp?: () => void,
    onDown?: () => void,
    onLeft?: () => void,
    onRight?: () => void
  ) => {
    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        onUp?.();
        break;
      case 'ArrowDown':
        e.preventDefault();
        onDown?.();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        onLeft?.();
        break;
      case 'ArrowRight':
        e.preventDefault();
        onRight?.();
        break;
    }
  },

  // Handle number key navigation
  handleNumberKeys: (
    e: React.KeyboardEvent,
    maxItems: number,
    onSelect: (index: number) => void
  ) => {
    const key = parseInt(e.key);
    if (!isNaN(key) && key >= 1 && key <= maxItems) {
      e.preventDefault();
      onSelect(key - 1);
    }
  },
};

// Skip link utility
export const createSkipLink = (targetId: string, label: string = 'Skip to main content') => {
  return {
    href: `#${targetId}`,
    className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md",
    onClick: (e: React.MouseEvent) => {
      e.preventDefault();
      const target = document.getElementById(targetId);
      target?.focus();
    },
    children: label,
  };
};

// Loading state utilities
export const loadingStates = {
  // Create accessible loading state
  createLoadingState: (isLoading: boolean, loadingText: string = 'Loading...') => ({
    'aria-busy': isLoading,
    'aria-live': 'polite',
    'aria-label': isLoading ? loadingText : undefined,
  }),

  // Create accessible progress indicator
  createProgressIndicator: (current: number, total: number, label?: string) => ({
    role: 'progressbar',
    'aria-valuenow': current,
    'aria-valuemin': 0,
    'aria-valuemax': total,
    'aria-label': label || `Progress: ${current} of ${total}`,
  }),
};

// Error handling utilities
export const errorHandling = {
  // Create accessible error message
  createErrorMessage: (error: string, errorId: string) => ({
    role: 'alert',
    'aria-live': 'assertive',
    id: errorId,
    className: 'text-destructive text-sm',
  }),

  // Create accessible form field
  createFormField: (
    id: string,
    label: string,
    error?: string,
    description?: string
  ) => ({
    id,
    'aria-describedby': [
      description && `${id}-description`,
      error && `${id}-error`,
    ].filter(Boolean).join(' ') || undefined,
    'aria-invalid': !!error,
    'aria-required': true,
  }),
};
