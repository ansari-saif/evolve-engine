/**
 * System Color Scheme Detection Utilities
 * 
 * Provides utilities for detecting and reacting to system color scheme preferences.
 * Integrates with the theme system to provide automatic light/dark mode switching.
 */

import { Theme } from '../theme';

export type SystemColorScheme = 'light' | 'dark' | 'no-preference';

/**
 * Detects the current system color scheme preference
 */
export function getSystemColorScheme(): SystemColorScheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'no-preference';
  }

  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }

  return 'no-preference';
}

/**
 * Maps system color scheme preference to an appropriate built-in theme
 */
export function mapSystemSchemeToTheme(scheme: SystemColorScheme): Theme {
  switch (scheme) {
    case 'dark':
      return 'dark';
    case 'light':
      return 'light';
    case 'no-preference':
    default:
      // Default to dark theme if no preference is detected
      return 'dark';
  }
}

/**
 * Gets the theme that should be applied when 'system' is selected
 */
export function getSystemPreferredTheme(): Theme {
  const systemScheme = getSystemColorScheme();
  return mapSystemSchemeToTheme(systemScheme);
}

/**
 * Creates a MediaQueryList listener for system color scheme changes
 */
export function createSystemColorSchemeListener(
  callback: (scheme: SystemColorScheme) => void
): () => void {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return () => {}; // No-op cleanup function
  }

  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const lightQuery = window.matchMedia('(prefers-color-scheme: light)');

  const handleChange = () => {
    callback(getSystemColorScheme());
  };

  // Add listeners
  darkQuery.addEventListener('change', handleChange);
  lightQuery.addEventListener('change', handleChange);

  // Return cleanup function
  return () => {
    darkQuery.removeEventListener('change', handleChange);
    lightQuery.removeEventListener('change', handleChange);
  };
}

/**
 * Hook-like utility for system color scheme detection with real-time updates
 * (This is a utility that can be called from React hooks)
 */
export class SystemColorSchemeManager {
  private listeners: Set<(scheme: SystemColorScheme) => void> = new Set();
  private cleanupFunction?: () => void;
  private currentScheme: SystemColorScheme;

  constructor() {
    this.currentScheme = getSystemColorScheme();
    this.setupListeners();
  }

  private setupListeners() {
    this.cleanupFunction = createSystemColorSchemeListener((scheme) => {
      if (this.currentScheme !== scheme) {
        this.currentScheme = scheme;
        this.notifyListeners(scheme);
      }
    });
  }

  private notifyListeners(scheme: SystemColorScheme) {
    this.listeners.forEach(listener => listener(scheme));
  }

  /**
   * Subscribe to system color scheme changes
   */
  subscribe(callback: (scheme: SystemColorScheme) => void): () => void {
    this.listeners.add(callback);
    
    // Immediately call with current scheme
    callback(this.currentScheme);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Get current system color scheme
   */
  getCurrentScheme(): SystemColorScheme {
    return this.currentScheme;
  }

  /**
   * Get the theme that should be applied for current system preference
   */
  getCurrentSystemTheme(): Theme {
    return mapSystemSchemeToTheme(this.currentScheme);
  }

  /**
   * Cleanup all listeners
   */
  destroy() {
    if (this.cleanupFunction) {
      this.cleanupFunction();
    }
    this.listeners.clear();
  }
}

// Global instance for shared usage
let globalSystemColorSchemeManager: SystemColorSchemeManager | null = null;

/**
 * Gets the global SystemColorSchemeManager instance
 */
export function getSystemColorSchemeManager(): SystemColorSchemeManager {
  if (!globalSystemColorSchemeManager) {
    globalSystemColorSchemeManager = new SystemColorSchemeManager();
  }
  return globalSystemColorSchemeManager;
}

/**
 * Utility to check if system theme preferences are supported
 */
export function isSystemColorSchemeSupported(): boolean {
  return typeof window !== 'undefined' && 
         typeof window.matchMedia === 'function' &&
         window.matchMedia('(prefers-color-scheme)').media === '(prefers-color-scheme)';
}