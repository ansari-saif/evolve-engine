/**
 * Theme Provider - Dynamic Theme Management
 * 
 * Provides theme switching capabilities with localStorage persistence.
 * Supports multiple theme variations while maintaining the existing CSS custom properties system.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Theme } from '../theme';

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

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  useEffect(() => {
    // Apply theme to document root
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark', 'startup', 'enterprise');
    
    // Add new theme class
    root.classList.add(theme);
    
    // Set data attribute for CSS targeting
    root.setAttribute('data-theme', theme);
    
  }, [theme]);

  const availableThemes: Theme[] = ['dark', 'light', 'startup', 'enterprise'];

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

// Theme switching utility
export const switchTheme = (theme: Theme): void => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'startup', 'enterprise');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
};

export default ThemeProvider;
