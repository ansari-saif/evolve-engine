/**
 * Design System Hook - Real Token Management
 * 
 * Provides actual functionality for modifying design tokens and managing themes.
 * This hook makes the Control Center truly interactive by applying real changes.
 */

import { useState, useEffect, useCallback } from 'react';
import { tokens } from '../theme';
import { updateCurrentThemeVariable } from '../utils/themeManager';

interface TokenUpdate {
  category: string;
  name: string;
  value: string;
}

interface CustomTheme {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    foreground: string;
    muted: string;
    accent: string;
  };
  gradients: {
    primary: string;
    secondary: string;
  };
  shadows: {
    card: string;
    glow: string;
  };
}

export const useDesignSystem = () => {
  const [customTokens, setCustomTokens] = useState<Record<string, string>>({});
  const [customThemes, setCustomThemes] = useState<CustomTheme[]>([]);
  const [activeCustomTheme, setActiveCustomTheme] = useState<string | null>(null);

  // Load saved customizations from localStorage
  useEffect(() => {
    try {
      const savedTokens = localStorage.getItem('evolve-custom-tokens');
      const savedThemes = localStorage.getItem('evolve-custom-themes');
      const savedActiveTheme = localStorage.getItem('evolve-active-custom-theme');

      if (savedTokens) {
        setCustomTokens(JSON.parse(savedTokens));
      }
      if (savedThemes) {
        setCustomThemes(JSON.parse(savedThemes));
      }
      if (savedActiveTheme) {
        setActiveCustomTheme(savedActiveTheme);
        applyCustomTheme(savedActiveTheme);
      }
    } catch (error) {
      console.error('Failed to load design system customizations:', error);
    }
  }, []);

  // Apply custom theme to CSS custom properties
  const applyCustomTheme = useCallback((themeId: string) => {
    const theme = customThemes.find(t => t.id === themeId);
    if (!theme) return;

    const root = document.documentElement;
    
    // Apply colors
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--surface', theme.colors.surface);
    root.style.setProperty('--foreground', theme.colors.foreground);
    root.style.setProperty('--muted', theme.colors.muted);
    root.style.setProperty('--accent', theme.colors.accent);
    
    // Apply gradients
    root.style.setProperty('--gradient-primary', theme.gradients.primary);
    root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
    
    // Apply shadows
    root.style.setProperty('--shadow-card', theme.shadows.card);
    root.style.setProperty('--shadow-glow', theme.shadows.glow);
  }, [customThemes]);

  // Update a design token
  const updateToken = useCallback((category: string, name: string, value: string) => {
    const tokenKey = `${category}.${name}`;
    // Normalize color input for CSS variable scheme
    const cssVarName = getCssVariableName(category, name);
    const normalized = normalizeTokenValue(category, name, value);
    const newCustomTokens = { ...customTokens, [tokenKey]: normalized };
    setCustomTokens(newCustomTokens);
    
    // Save to localStorage
    localStorage.setItem('evolve-custom-tokens', JSON.stringify(newCustomTokens));
    
    // Apply the change to CSS custom properties
    const root = document.documentElement;
    if (cssVarName) {
      root.style.setProperty(cssVarName, normalized);
      // Persist per active theme using themeManager
      updateCurrentThemeVariable(cssVarName, normalized);
    }
    
    console.log(`Updated token ${tokenKey} to ${normalized}`);
  }, [customTokens]);

  // Get CSS variable name from token category and name
  const getCssVariableName = (category: string, name: string): string | null => {
    const mappings: Record<string, Record<string, string>> = {
      colors: {
        'Primary': '--primary',
        'Secondary': '--secondary',
        'Success': '--success',
        'Warning': '--warning',
        'Danger': '--danger',
        'Background': '--background',
        'Surface': '--surface',
        'Foreground': '--foreground',
        'Muted': '--muted',
        'Accent': '--accent',
      },
      gradients: {
        'Primary': '--gradient-primary',
        'Motivation': '--gradient-motivation',
        'Success': '--gradient-success',
        'Warning': '--gradient-warning',
        'Subtle': '--gradient-subtle',
      },
      shadows: {
        'Elegant': '--shadow-elegant',
        'Glow': '--shadow-glow',
        'Card': '--shadow-card',
      },
      animations: {
        'Smooth': '--transition-smooth',
        'Spring': '--transition-spring',
      }
    };
    
    return mappings[category.toLowerCase()]?.[name] || null;
  };

  // Normalize token values based on category/name for consistent storage
  const normalizeTokenValue = (category: string, name: string, value: string): string => {
    if (category.toLowerCase() === 'colors') {
      // Accept formats: "H S% L%" (preferred), hsl(H S% L%), rgb(a), hex
      const trimmed = value.trim();
      if (/^\d+\s+\d+%\s+\d+%$/.test(trimmed)) {
        return trimmed; // already H S% L%
      }
      const hslMatch = trimmed.match(/^hsl\(\s*(\d+)\s*,?\s*(\d+)%\s*,?\s*(\d+)%\s*\)$/i);
      if (hslMatch) {
        const [, h, s, l] = hslMatch;
        return `${h} ${s}% ${l}%`;
      }
      const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
      if (rgbMatch) {
        const r = parseInt(rgbMatch[1], 10);
        const g = parseInt(rgbMatch[2], 10);
        const b = parseInt(rgbMatch[3], 10);
        const { h, s, l } = rgbToHsl(r, g, b);
        return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
      }
      const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
      if (hexMatch) {
        const { r, g, b } = hexToRgb(trimmed);
        const { h, s, l } = rgbToHsl(r, g, b);
        return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
      }
      // Fallback: keep as-is
      return trimmed;
    }
    // For other categories (gradients, shadows, etc.) keep raw string
    return value;
  };

  // Helpers
  const normalizeColorToHslNumbers = (value: string): string => {
    const trimmed = value.trim();
    if (/^\d+\s+\d+%\s+\d+%$/.test(trimmed)) return trimmed;
    const hslMatch = trimmed.match(/^hsl\(\s*(\d+)\s*,?\s*(\d+)%\s*,?\s*(\d+)%\s*\)$/i);
    if (hslMatch) {
      const [, h, s, l] = hslMatch;
      return `${h} ${s}% ${l}%`;
    }
    const rgbMatch = trimmed.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1], 10);
      const g = parseInt(rgbMatch[2], 10);
      const b = parseInt(rgbMatch[3], 10);
      const { h, s, l } = rgbToHsl(r, g, b);
      return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
    }
    const hexMatch = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (hexMatch) {
      const { r, g, b } = hexToRgb(trimmed);
      const { h, s, l } = rgbToHsl(r, g, b);
      return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`;
    }
    return trimmed;
  };
  const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h.split('').map((c) => c + c).join('');
    }
    const num = parseInt(h, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0; const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h *= 60;
    }
    return { h, s: s * 100, l: l * 100 };
  };

  // Create a new custom theme
  const createCustomTheme = useCallback((name: string, colors: CustomTheme['colors']) => {
    // Normalize provided colors to H S% L% strings; if not provided, snapshot current CSS var values
    const styles = getComputedStyle(document.documentElement);
    const getVar = (v: string) => styles.getPropertyValue(v).trim();
    const normalizedColors = {
      primary: normalizeColorToHslNumbers(colors.primary || getVar('--primary')),
      secondary: normalizeColorToHslNumbers(colors.secondary || getVar('--secondary')),
      background: normalizeColorToHslNumbers(colors.background || getVar('--background')),
      surface: normalizeColorToHslNumbers(colors.surface || getVar('--surface')),
      foreground: normalizeColorToHslNumbers((colors as any).foreground || getVar('--foreground')),
      muted: normalizeColorToHslNumbers((colors as any).muted || getVar('--muted')),
      accent: normalizeColorToHslNumbers((colors as any).accent || getVar('--accent')),
    } as CustomTheme['colors'] & { foreground: string; muted: string; accent: string };

    const newTheme: CustomTheme = {
      id: `custom-${Date.now()}`,
      name,
      colors: {
        primary: normalizedColors.primary,
        secondary: normalizedColors.secondary,
        background: normalizedColors.background,
        surface: normalizedColors.surface,
      } as CustomTheme['colors'],
      gradients: {
        primary: `linear-gradient(135deg, hsl(${normalizedColors.primary}) 0%, hsl(${normalizedColors.secondary}) 100%)`,
        secondary: `linear-gradient(135deg, hsl(${normalizedColors.secondary}) 0%, hsl(${normalizedColors.accent}) 100%)`,
      },
      shadows: {
        card: `0 4px 16px -4px hsl(${normalizedColors.background} / 0.25)`,
        glow: `0 0 40px hsl(${normalizedColors.primary} / 0.35)`,
      }
    };
    
    const newThemes = [...customThemes, newTheme];
    setCustomThemes(newThemes);
    localStorage.setItem('evolve-custom-themes', JSON.stringify(newThemes));
    
    return newTheme;
  }, [customThemes]);

  // Delete a custom theme
  const deleteCustomTheme = useCallback((themeId: string) => {
    const newThemes = customThemes.filter(theme => theme.id !== themeId);
    setCustomThemes(newThemes);
    localStorage.setItem('evolve-custom-themes', JSON.stringify(newThemes));
    
    // If this was the active theme, clear it
    if (activeCustomTheme === themeId) {
      setActiveCustomTheme(null);
      localStorage.removeItem('evolve-active-custom-theme');
      resetToDefaultTheme();
    }
  }, [customThemes, activeCustomTheme]);

  // Apply a custom theme
  const applyCustomThemeById = useCallback((themeId: string) => {
    setActiveCustomTheme(themeId);
    localStorage.setItem('evolve-active-custom-theme', themeId);
    applyCustomTheme(themeId);
  }, [applyCustomTheme]);

  // Update a specific color in a custom theme (hex, hsl(), or H S% L% accepted)
  const updateCustomThemeColor = useCallback((themeId: string, key: keyof CustomTheme['colors'], value: string) => {
    const hslNumbers = normalizeColorToHslNumbers(value);
    setCustomThemes((prev) => {
      const updated = prev.map((t) => t.id === themeId ? {
        ...t,
        colors: { ...t.colors, [key]: hslNumbers },
        gradients: {
          primary: `linear-gradient(135deg, hsl(${(t.id === themeId ? (key === 'primary' ? hslNumbers : (t.colors as any).primary) : (t.colors as any).primary)}) 0%, hsl(${(t.id === themeId ? (key === 'secondary' ? hslNumbers : (t.colors as any).secondary) : (t.colors as any).secondary)}) 100%)`,
          secondary: `linear-gradient(135deg, hsl(${(t.id === themeId ? (key === 'secondary' ? hslNumbers : (t.colors as any).secondary) : (t.colors as any).secondary)}) 0%, hsl(${(t.id === themeId ? (key === 'accent' ? hslNumbers : (t.colors as any).accent) : (t.colors as any).accent)}) 100%)`,
        },
        shadows: {
          card: `0 4px 16px -4px hsl(${(t.id === themeId ? (key === 'background' ? hslNumbers : (t.colors as any).background) : (t.colors as any).background)} / 0.25)`,
          glow: `0 0 40px hsl(${(t.id === themeId ? (key === 'primary' ? hslNumbers : (t.colors as any).primary) : (t.colors as any).primary)} / 0.35)`,
        }
      } : t);
      localStorage.setItem('evolve-custom-themes', JSON.stringify(updated));
      return updated;
    });
    if (activeCustomTheme === themeId) {
      applyCustomTheme(themeId);
    }
  }, [activeCustomTheme, applyCustomTheme]);

  // Reset to default theme
  const resetToDefaultTheme = useCallback(() => {
    const root = document.documentElement;
    
    // Reset all custom properties to their original values
    const defaultValues = {
      '--primary': 'hsl(231 48% 63%)',
      '--secondary': 'hsl(328 86% 70%)',
      '--background': 'hsl(220 13% 6%)',
      '--surface': 'hsl(217 19% 12%)',
      '--foreground': 'hsl(210 20% 95%)',
      '--muted': 'hsl(215 16% 17%)',
      '--accent': 'hsl(215 16% 17%)',
      '--gradient-primary': 'linear-gradient(135deg, hsl(231 48% 63%) 0%, hsl(250 84% 70%) 100%)',
      '--gradient-motivation': 'linear-gradient(135deg, hsl(328 86% 70%) 0%, hsl(347 77% 65%) 100%)',
      '--shadow-card': '0 4px 16px -4px hsl(217 19% 8% / 0.4)',
      '--shadow-glow': '0 0 40px hsl(231 48% 70% / 0.4)',
    };
    
    Object.entries(defaultValues).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
  }, []);

  // Get current token value (custom or default)
  const getTokenValue = useCallback((category: string, name: string) => {
    const tokenKey = `${category}.${name}`;
    return customTokens[tokenKey] || getDefaultTokenValue(category, name);
  }, [customTokens]);

  // Get default token value
  const getDefaultTokenValue = (category: string, name: string): string => {
    const mappings: Record<string, Record<string, string>> = {
      colors: {
        'Primary': tokens.colors.primary.DEFAULT,
        'Secondary': tokens.colors.secondary.DEFAULT,
        'Success': tokens.colors.success.DEFAULT,
        'Warning': tokens.colors.warning.DEFAULT,
        'Danger': tokens.colors.danger.DEFAULT,
        'Background': tokens.colors.background,
        'Surface': tokens.colors.surface,
      },
      gradients: {
        'Primary': tokens.gradients.primary,
        'Motivation': tokens.gradients.motivation,
        'Success': tokens.gradients.success,
        'Warning': tokens.gradients.warning,
        'Subtle': tokens.gradients.subtle,
      },
      shadows: {
        'Elegant': tokens.shadows.elegant,
        'Glow': tokens.shadows.glow,
        'Card': tokens.shadows.card,
      },
      animations: {
        'Smooth': tokens.animations.smooth,
        'Spring': tokens.animations.spring,
      }
    };
    
    return mappings[category.toLowerCase()]?.[name] || '';
  };

  // Export design system configuration
  const exportConfiguration = useCallback(() => {
    const config = {
      customTokens,
      customThemes,
      activeCustomTheme,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `evolve-design-system-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [customTokens, customThemes, activeCustomTheme]);

  // Import design system configuration
  const importConfiguration = useCallback((file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const config = JSON.parse(e.target?.result as string);
          
          if (config.customTokens) {
            setCustomTokens(config.customTokens);
            localStorage.setItem('evolve-custom-tokens', JSON.stringify(config.customTokens));
          }
          
          if (config.customThemes) {
            setCustomThemes(config.customThemes);
            localStorage.setItem('evolve-custom-themes', JSON.stringify(config.customThemes));
          }
          
          if (config.activeCustomTheme) {
            setActiveCustomTheme(config.activeCustomTheme);
            localStorage.setItem('evolve-active-custom-theme', config.activeCustomTheme);
            applyCustomTheme(config.activeCustomTheme);
          }
          
          resolve(config);
        } catch (error) {
          reject(error);
        }
      };
      reader.readAsText(file);
    });
  }, [applyCustomTheme]);

  return {
    // Token management
    updateToken,
    getTokenValue,
    customTokens,
    
    // Theme management
    createCustomTheme,
    deleteCustomTheme,
    applyCustomThemeById,
    customThemes,
    activeCustomTheme,
    resetToDefaultTheme,
    updateCustomThemeColor,
    
    // Import/Export
    exportConfiguration,
    importConfiguration,
  };
};
