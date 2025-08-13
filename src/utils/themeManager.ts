/**
 * Theme Manager
 *
 * Persists and applies CSS variable maps for named themes using localStorage.
 * Works with Tailwind's CSS variables setup and the existing ThemeProvider.
 */

import type { Theme } from '../theme';

const STORAGE_THEME_KEY = 'evolve-theme';
const STORAGE_VARS_PREFIX = 'evolve-theme-vars-';

// The list of CSS variables we manage for themes
const THEME_VARIABLE_KEYS = [
  '--background',
  '--foreground',
  '--surface',
  '--surface-light',
  '--card',
  '--card-foreground',
  '--popover',
  '--popover-foreground',
  '--primary',
  '--primary-dark',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--success',
  '--success-foreground',
  '--warning',
  '--warning-foreground',
  '--danger',
  '--danger-foreground',
  '--destructive',
  '--destructive-foreground',
  '--text-primary',
  '--text-secondary',
  '--text-muted',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--border',
  '--input',
  '--ring',
  '--gradient-primary',
  '--gradient-success',
  '--gradient-motivation',
  '--gradient-warning',
  '--gradient-subtle',
  '--shadow-elegant',
  '--shadow-glow',
  '--shadow-card',
  '--transition-smooth',
  '--transition-spring',
  '--radius',
  '--sidebar-background',
  '--sidebar-foreground',
  '--sidebar-primary',
  '--sidebar-primary-foreground',
  '--sidebar-accent',
  '--sidebar-accent-foreground',
  '--sidebar-border',
  '--sidebar-ring'
];

export type ThemeVariables = Record<string, string>;

// Default preset variable maps (aligned with src/index.css for dark)
const PRESET_DARK: ThemeVariables = {
  '--background': '220 13% 6%',
  '--foreground': '210 20% 95%',
  '--surface': '217 19% 12%',
  '--surface-light': '215 16% 17%',
  '--card': '217 19% 12%',
  '--card-foreground': '210 20% 95%',
  '--popover': '217 19% 12%',
  '--popover-foreground': '210 20% 95%',
  '--primary': '231 48% 63%',
  '--primary-dark': '232 54% 56%',
  '--primary-foreground': '210 20% 95%',
  '--secondary': '328 86% 70%',
  '--secondary-foreground': '210 20% 95%',
  '--success': '158 64% 52%',
  '--success-foreground': '210 20% 95%',
  '--warning': '43 96% 56%',
  '--warning-foreground': '220 13% 6%',
  '--danger': '0 84% 60%',
  '--danger-foreground': '210 20% 95%',
  '--destructive': '0 84% 60%',
  '--destructive-foreground': '210 20% 95%',
  '--text-primary': '210 20% 95%',
  '--text-secondary': '215 16% 65%',
  '--text-muted': '215 20% 45%',
  '--muted': '215 16% 17%',
  '--muted-foreground': '215 16% 65%',
  '--accent': '215 16% 17%',
  '--accent-foreground': '210 20% 95%',
  '--border': '215 16% 17%',
  '--input': '215 16% 17%',
  '--ring': '231 48% 63%',
  '--gradient-primary': 'linear-gradient(135deg, hsl(231 48% 63%) 0%, hsl(250 84% 70%) 100%)',
  '--gradient-success': 'linear-gradient(135deg, hsl(158 64% 52%) 0%, hsl(158 84% 45%) 100%)',
  '--gradient-motivation': 'linear-gradient(135deg, hsl(328 86% 70%) 0%, hsl(347 77% 65%) 100%)',
  '--gradient-warning': 'linear-gradient(135deg, hsl(43 96% 56%) 0%, hsl(38 92% 50%) 100%)',
  '--gradient-subtle': 'linear-gradient(180deg, hsl(217 19% 12%) 0%, hsl(220 13% 9%) 100%)',
  '--shadow-elegant': '0 10px 30px -10px hsl(231 48% 63% / 0.3)',
  '--shadow-glow': '0 0 40px hsl(231 48% 70% / 0.4)',
  '--shadow-card': '0 4px 16px -4px hsl(217 19% 8% / 0.4)',
  '--transition-smooth': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '--transition-spring': 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
  '--radius': '0.75rem',
  '--sidebar-background': '217 19% 12%',
  '--sidebar-foreground': '215 16% 65%',
  '--sidebar-primary': '231 48% 63%',
  '--sidebar-primary-foreground': '210 20% 95%',
  '--sidebar-accent': '215 16% 17%',
  '--sidebar-accent-foreground': '210 20% 95%',
  '--sidebar-border': '215 16% 17%',
  '--sidebar-ring': '231 48% 63%'
};

const PRESET_LIGHT: ThemeVariables = {
  '--background': '0 0% 100%',
  '--foreground': '220 15% 15%',
  '--surface': '0 0% 100%',
  '--surface-light': '220 15% 97%',
  '--card': '0 0% 100%',
  '--card-foreground': '220 15% 15%',
  '--popover': '0 0% 100%',
  '--popover-foreground': '220 15% 15%',
  '--primary': '231 48% 48%',
  '--primary-dark': '232 54% 40%',
  '--primary-foreground': '0 0% 100%',
  '--secondary': '328 86% 52%',
  '--secondary-foreground': '0 0% 100%',
  '--success': '158 64% 40%',
  '--success-foreground': '0 0% 100%',
  '--warning': '43 96% 45%',
  '--warning-foreground': '220 13% 10%',
  '--danger': '0 84% 50%',
  '--danger-foreground': '0 0% 100%',
  '--destructive': '0 84% 50%',
  '--destructive-foreground': '0 0% 100%',
  '--text-primary': '220 15% 15%',
  '--text-secondary': '220 10% 40%',
  '--text-muted': '220 10% 55%',
  '--muted': '220 10% 96%',
  '--muted-foreground': '220 10% 40%',
  '--accent': '220 10% 96%',
  '--accent-foreground': '220 15% 15%',
  '--border': '220 10% 90%',
  '--input': '220 10% 90%',
  '--ring': '231 48% 48%',
  '--gradient-primary': 'linear-gradient(135deg, hsl(231 48% 48%) 0%, hsl(250 84% 60%) 100%)',
  '--gradient-success': 'linear-gradient(135deg, hsl(158 64% 40%) 0%, hsl(158 84% 35%) 100%)',
  '--gradient-motivation': 'linear-gradient(135deg, hsl(328 86% 52%) 0%, hsl(347 77% 50%) 100%)',
  '--gradient-warning': 'linear-gradient(135deg, hsl(43 96% 45%) 0%, hsl(38 92% 45%) 100%)',
  '--gradient-subtle': 'linear-gradient(180deg, hsl(0 0% 100%) 0%, hsl(220 15% 97%) 100%)',
  '--shadow-elegant': '0 10px 30px -10px hsl(231 48% 48% / 0.2)',
  '--shadow-glow': '0 0 40px hsl(231 48% 60% / 0.25)',
  '--shadow-card': '0 4px 16px -4px hsl(220 15% 20% / 0.1)',
  '--transition-smooth': 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '--transition-spring': 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
  '--radius': '0.75rem',
  '--sidebar-background': '0 0% 100%',
  '--sidebar-foreground': '220 10% 40%',
  '--sidebar-primary': '231 48% 48%',
  '--sidebar-primary-foreground': '0 0% 100%',
  '--sidebar-accent': '220 10% 96%',
  '--sidebar-accent-foreground': '220 15% 15%',
  '--sidebar-border': '220 10% 90%',
  '--sidebar-ring': '231 48% 48%'
};

const PRESET_STARTUP: ThemeVariables = {
  ...PRESET_DARK,
  '--primary': '260 90% 66%',
  '--primary-dark': '258 90% 60%',
  '--secondary': '200 98% 55%',
  '--gradient-primary': 'linear-gradient(135deg, hsl(260 90% 66%) 0%, hsl(200 98% 55%) 100%)',
  '--shadow-glow': '0 0 40px hsl(260 90% 66% / 0.45)'
};

const PRESET_ENTERPRISE: ThemeVariables = {
  ...PRESET_DARK,
  '--background': '220 10% 8%',
  '--surface': '220 10% 12%',
  '--surface-light': '220 10% 16%',
  '--primary': '215 28% 40%',
  '--primary-dark': '215 28% 34%',
  '--secondary': '210 10% 45%',
  '--ring': '215 28% 40%'
};

const PRESETS: Record<Theme, ThemeVariables> = {
  dark: PRESET_DARK,
  light: PRESET_LIGHT,
  startup: PRESET_STARTUP,
  enterprise: PRESET_ENTERPRISE
};

export const getStoredThemeName = (): Theme | null => {
  try {
    return (localStorage.getItem(STORAGE_THEME_KEY) as Theme) || null;
  } catch {
    return null;
  }
};

export const getThemeVariables = (theme: Theme): ThemeVariables => {
  try {
    const raw = localStorage.getItem(STORAGE_VARS_PREFIX + theme);
    if (raw) return JSON.parse(raw);
  } catch {}
  return PRESETS[theme];
};

export const saveThemeVariables = (theme: Theme, vars: ThemeVariables): void => {
  try {
    localStorage.setItem(STORAGE_VARS_PREFIX + theme, JSON.stringify(vars));
  } catch {}
};

export const ensurePresetSaved = (theme: Theme): void => {
  try {
    const key = STORAGE_VARS_PREFIX + theme;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, JSON.stringify(PRESETS[theme]));
    }
  } catch {}
};

export const applyThemeVariables = (theme: Theme): void => {
  const vars = getThemeVariables(theme);
  const root = document.documentElement;
  // Apply only known keys to avoid leaking unexpected styles
  THEME_VARIABLE_KEYS.forEach((key) => {
    const value = vars[key];
    if (typeof value === 'string') {
      root.style.setProperty(key, value);
    }
  });
};

export const applyTheme = (theme: Theme): void => {
  const root = document.documentElement;
  root.classList.remove('light', 'dark', 'startup', 'enterprise');
  root.classList.add(theme);
  root.setAttribute('data-theme', theme);
  applyThemeVariables(theme);
};

export const updateCurrentThemeVariable = (cssVarName: string, value: string): void => {
  const current = (getStoredThemeName() || 'dark') as Theme;
  const vars = { ...getThemeVariables(current), [cssVarName]: value };
  saveThemeVariables(current, vars);
  document.documentElement.style.setProperty(cssVarName, value);
};

export const listManagedVariables = (): string[] => [...THEME_VARIABLE_KEYS];

export const snapshotCurrentThemeVariables = (theme: Theme): void => {
  const styles = getComputedStyle(document.documentElement);
  const vars: ThemeVariables = {};
  THEME_VARIABLE_KEYS.forEach((key) => {
    const v = styles.getPropertyValue(key).trim();
    if (v) vars[key] = v;
  });
  saveThemeVariables(theme, vars);
};


