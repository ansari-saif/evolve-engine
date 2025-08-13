/**
 * Theme Provider - Dynamic Theme Management
 * 
 * Provides theme switching capabilities with localStorage persistence.
 * Supports multiple theme variations while maintaining the existing CSS custom properties system.
 */

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Theme } from '../theme';
import { applyTheme, ensurePresetSaved } from '../utils/themeManager';
import { listThemes } from '../utils/themeRegistry';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  availableThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

const STORAGE_KEY = 'evolve-theme';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = 'dark'
}) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // Try to get theme from localStorage, fallback to default
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored as Theme) || defaultTheme;
    } catch {
      return defaultTheme;
    }
  });

  const [availableThemes, setAvailableThemes] = useState<Theme[]>(() => {
    // Filter to built-ins to match Theme union type
    const builtIns: Theme[] = ['dark', 'light', 'startup', 'enterprise'];
    try {
      const fromRegistry = listThemes().filter((t): t is Theme => (builtIns as string[]).includes(t));
      return fromRegistry.length ? fromRegistry : builtIns;
    } catch {
      return builtIns;
    }
  });

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  useEffect(() => {
    // Ensure a preset map exists and apply both the class and variables
    ensurePresetSaved(theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    const handler = () => {
      const builtIns: Theme[] = ['dark', 'light', 'startup', 'enterprise'];
      try {
        const fromRegistry = listThemes().filter((t): t is Theme => (builtIns as string[]).includes(t));
        setAvailableThemes(fromRegistry.length ? fromRegistry : builtIns);
      } catch {
        setAvailableThemes(builtIns);
      }
    };
    // Initialize once on mount as well
    handler();
    window.addEventListener('evolve-theme-registry-changed', handler as EventListener);
    return () => window.removeEventListener('evolve-theme-registry-changed', handler as EventListener);
  }, []);

  const value: ThemeContextType = {
    theme,
    setTheme,
    availableThemes
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Convenience hooks for narrower consumption
export const useSetTheme = () => {
  const { setTheme } = useTheme();
  return setTheme;
};

export const useAvailableThemes = () => {
  const { availableThemes } = useTheme();
  return availableThemes;
};

// Theme switching utility
export const switchTheme = (theme: Theme): void => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'startup', 'enterprise');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
};

export default ThemeProvider;
