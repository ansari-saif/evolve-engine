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
import { MigrationService } from '../utils/themeMigration';
import { getSystemColorSchemeManager, isSystemColorSchemeSupported } from '../utils/systemColorScheme';

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
const UPGRADE_FLAG_KEY = 'evolve-theme-upgraded-lightning-v1';

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
    // Include all built-ins including 'system' if supported
    const builtIns: Theme[] = isSystemColorSchemeSupported() 
      ? ['system', 'high-contrast', 'dark', 'light', 'startup', 'enterprise', 'lightning']
      : ['high-contrast', 'dark', 'light', 'startup', 'enterprise', 'lightning'];
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

  // One-time rollout: if no upgrade flag exists, set default theme once (e.g., to 'lightning')
  useEffect(() => {
    try {
      const upgraded = localStorage.getItem(UPGRADE_FLAG_KEY);
      if (!upgraded) {
        localStorage.setItem(UPGRADE_FLAG_KEY, '1');
        // Apply the provider's default theme once across users
        setTheme(defaultTheme);
      }
    } catch {
      // Non-blocking if storage not available
      setTheme(defaultTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handler = () => {
      const builtIns: Theme[] = isSystemColorSchemeSupported() 
        ? ['system', 'high-contrast', 'dark', 'light', 'startup', 'enterprise', 'lightning']
        : ['high-contrast', 'dark', 'light', 'startup', 'enterprise', 'lightning'];
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

  // Handle system color scheme changes for 'system' theme
  useEffect(() => {
    if (!isSystemColorSchemeSupported() || theme !== 'system') {
      return;
    }

    const systemManager = getSystemColorSchemeManager();
    
    // Subscribe to system color scheme changes
    const unsubscribe = systemManager.subscribe(() => {
      // Re-apply the system theme to pick up the new system preference
      ensurePresetSaved(theme);
      applyTheme(theme);
    });

    return unsubscribe;
  }, [theme]);

  // Handle theme migration on first load
  useEffect(() => {
    const runMigration = async () => {
      try {
        if (MigrationService.detectLegacyData()) {
          console.log('Legacy theme data detected, starting migration...');
          const result = await MigrationService.migrateLegacyData();
          
          if (result.success) {
            console.log(`Migration completed: ${result.migratedThemes} themes, ${result.migratedTokens} tokens migrated`);
            
            // Clean up legacy data after successful migration
            MigrationService.cleanupLegacyData();
            
            // Refresh available themes since registry may have changed
            const builtIns: Theme[] = ['dark', 'light', 'startup', 'enterprise', 'lightning'];
            try {
              const fromRegistry = listThemes().filter((t): t is Theme => (builtIns as string[]).includes(t));
              setAvailableThemes(fromRegistry.length ? fromRegistry : builtIns);
            } catch {
              setAvailableThemes(builtIns);
            }
          } else {
            console.warn('Migration completed with errors:', result.errors);
            // Don't cleanup on partial failure to allow retry
          }
        }
      } catch (error) {
        console.error('Theme migration failed:', error);
      }
    };

    // Run migration asynchronously to avoid blocking initialization
    runMigration();
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
  root.classList.remove('light', 'dark', 'startup', 'enterprise', 'lightning');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
};

export default ThemeProvider;
