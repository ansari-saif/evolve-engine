import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { tokens } from '../theme';

interface ThemeContextType {
  // Theme state
  currentTheme: 'light' | 'dark' | 'system';
  isDarkMode: boolean;
  
  // Theme actions
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  toggleTheme: () => void;
  
  // Design tokens
  tokens: typeof tokens;
  
  // Theme utilities
  getColor: (colorKey: string) => string;
  getSpacing: (spacingKey: string) => string;
  getTypography: (typographyKey: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initialTheme?: 'light' | 'dark' | 'system';
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ 
  children, 
  initialTheme = 'system' 
}) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'system'>(initialTheme);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const setTheme = useCallback((theme: 'light' | 'dark' | 'system') => {
    setCurrentTheme(theme);
    
    // Apply theme to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
  }, [currentTheme, setTheme]);

  const getColor = useCallback((colorKey: string) => {
    // Navigate through tokens to get color value
    const keys = colorKey.split('.');
    let value: Record<string, unknown> | unknown = tokens.colors;
    
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = (value as Record<string, unknown>)[key];
      } else {
        return '#000000';
      }
    }
    
    return (typeof value === 'string' ? value : '#000000');
  }, []);

  const getSpacing = useCallback((spacingKey: string) => {
    return tokens.spacing[spacingKey as keyof typeof tokens.spacing] || '0px';
  }, []);

  const getTypography = useCallback((typographyKey: string) => {
    return tokens.typography[typographyKey as keyof typeof tokens.typography] || '';
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    isDarkMode,
    setTheme,
    toggleTheme,
    tokens,
    getColor,
    getSpacing,
    getTypography,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Hook for accessing only theme state
export const useThemeState = () => {
  const { currentTheme, isDarkMode } = useTheme();
  return { currentTheme, isDarkMode };
};

// Hook for accessing only theme actions
export const useThemeActions = () => {
  const { setTheme, toggleTheme } = useTheme();
  return { setTheme, toggleTheme };
};

// Hook for accessing only design tokens
export const useDesignTokens = () => {
  const { tokens, getColor, getSpacing, getTypography } = useTheme();
  return { tokens, getColor, getSpacing, getTypography };
};
