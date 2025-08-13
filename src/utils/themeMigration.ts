/**
 * Theme Migration Service
 * 
 * Handles migration from legacy theme storage formats to the new centralized system.
 * Detects and converts legacy data while preserving user customizations.
 */

interface LegacyCustomTheme {
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

interface LegacyData {
  customTokens?: Record<string, string>;
  customThemes?: LegacyCustomTheme[];
  activeCustomTheme?: string;
}

interface MigrationResult {
  success: boolean;
  migratedThemes: number;
  migratedTokens: number;
  errors: string[];
}

export class MigrationService {
  private static readonly LEGACY_KEYS = {
    CUSTOM_TOKENS: 'evolve-custom-tokens',
    CUSTOM_THEMES: 'evolve-custom-themes', 
    ACTIVE_CUSTOM_THEME: 'evolve-active-custom-theme'
  };

  private static readonly NEW_KEYS = {
    THEME_REGISTRY: 'evolve-theme-registry',
    THEME: 'evolve-theme',
    THEME_VARS_PREFIX: 'evolve-theme-vars-'
  };

  /**
   * Detects presence of legacy theme data in localStorage
   */
  static detectLegacyData(): boolean {
    try {
      return Object.values(this.LEGACY_KEYS).some(key => {
        const data = localStorage.getItem(key);
        return data !== null && data.trim() !== '';
      });
    } catch (error) {
      console.warn('Failed to detect legacy data:', error);
      return false;
    }
  }

  /**
   * Retrieves and parses legacy data from localStorage
   */
  private static getLegacyData(): LegacyData {
    const legacyData: LegacyData = {};

    try {
      const customTokensData = localStorage.getItem(this.LEGACY_KEYS.CUSTOM_TOKENS);
      if (customTokensData) {
        legacyData.customTokens = JSON.parse(customTokensData);
      }

      const customThemesData = localStorage.getItem(this.LEGACY_KEYS.CUSTOM_THEMES);
      if (customThemesData) {
        legacyData.customThemes = JSON.parse(customThemesData);
      }

      const activeCustomTheme = localStorage.getItem(this.LEGACY_KEYS.ACTIVE_CUSTOM_THEME);
      if (activeCustomTheme) {
        legacyData.activeCustomTheme = activeCustomTheme;
      }
    } catch (error) {
      console.error('Failed to parse legacy data:', error);
    }

    return legacyData;
  }

  /**
   * Converts legacy custom theme to new CSS variables format
   */
  private static convertThemeToVariables(theme: LegacyCustomTheme): Record<string, string> {
    const variables: Record<string, string> = {};

    // Convert colors
    if (theme.colors) {
      variables['--primary'] = theme.colors.primary || '';
      variables['--secondary'] = theme.colors.secondary || '';
      variables['--background'] = theme.colors.background || '';
      variables['--surface'] = theme.colors.surface || '';
      variables['--foreground'] = theme.colors.foreground || '';
      variables['--muted'] = theme.colors.muted || '';
      variables['--accent'] = theme.colors.accent || '';
    }

    // Convert gradients
    if (theme.gradients) {
      variables['--gradient-primary'] = theme.gradients.primary || '';
      variables['--gradient-secondary'] = theme.gradients.secondary || '';
    }

    // Convert shadows
    if (theme.shadows) {
      variables['--shadow-card'] = theme.shadows.card || '';
      variables['--shadow-glow'] = theme.shadows.glow || '';
    }

    return variables;
  }

  /**
   * Migrates legacy data to new storage format
   */
  static async migrateLegacyData(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedThemes: 0,
      migratedTokens: 0,
      errors: []
    };

    try {
      const legacyData = this.getLegacyData();
      
      // Get current registry or create new one
      let registry: Record<string, unknown> = {};
      try {
        const registryData = localStorage.getItem(this.NEW_KEYS.THEME_REGISTRY);
        if (registryData) {
          registry = JSON.parse(registryData);
        }
      } catch (error) {
        console.warn('Failed to load existing registry, creating new one');
        registry = {
          themes: {
            dark: { label: 'Dark', builtIn: true },
            light: { label: 'Light', builtIn: true },
            startup: { label: 'Startup', builtIn: true },
            enterprise: { label: 'Enterprise', builtIn: true }
          }
        };
      }

      // Migrate custom themes
      if (legacyData.customThemes && Array.isArray(legacyData.customThemes)) {
        for (const theme of legacyData.customThemes) {
          try {
            // Add to registry
            registry.themes = registry.themes || {};
            registry.themes[theme.id] = {
              label: theme.name,
              builtIn: false
            };

            // Convert and save theme variables
            const variables = this.convertThemeToVariables(theme);
            const themeVarsKey = this.NEW_KEYS.THEME_VARS_PREFIX + theme.id;
            localStorage.setItem(themeVarsKey, JSON.stringify(variables));

            result.migratedThemes++;
          } catch (error) {
            result.errors.push(`Failed to migrate theme "${theme.name}": ${error}`);
          }
        }
      }

      // Migrate custom tokens (apply to default theme variables if no specific theme context)
      if (legacyData.customTokens && typeof legacyData.customTokens === 'object') {
        try {
          // Apply custom tokens to the current theme or a default theme
          const activeTheme = legacyData.activeCustomTheme || 'dark';
          const existingVarsKey = this.NEW_KEYS.THEME_VARS_PREFIX + activeTheme;
          let existingVars: Record<string, string> = {};
          
          try {
            const existingData = localStorage.getItem(existingVarsKey);
            if (existingData) {
              existingVars = JSON.parse(existingData);
            }
          } catch (error) {
            console.warn('Failed to load existing theme variables');
          }

          // Convert token format to CSS variables
          for (const [tokenKey, tokenValue] of Object.entries(legacyData.customTokens)) {
            const cssVar = this.convertTokenToCSSVariable(tokenKey, tokenValue);
            if (cssVar) {
              existingVars[cssVar.name] = cssVar.value;
              result.migratedTokens++;
            }
          }

          localStorage.setItem(existingVarsKey, JSON.stringify(existingVars));
        } catch (error) {
          result.errors.push(`Failed to migrate custom tokens: ${error}`);
        }
      }

      // Save updated registry
      localStorage.setItem(this.NEW_KEYS.THEME_REGISTRY, JSON.stringify(registry));

      // Set active theme if one was specified
      if (legacyData.activeCustomTheme) {
        localStorage.setItem(this.NEW_KEYS.THEME, legacyData.activeCustomTheme);
      }

      // Dispatch registry changed event to update UI
      window.dispatchEvent(new Event('evolve-theme-registry-changed'));

      result.success = result.errors.length === 0 || (result.migratedThemes > 0 || result.migratedTokens > 0);

      console.log('Theme migration completed:', result);
    } catch (error) {
      result.errors.push(`Migration failed: ${error}`);
      console.error('Theme migration failed:', error);
    }

    return result;
  }

  /**
   * Converts legacy token format to CSS variable
   */
  private static convertTokenToCSSVariable(tokenKey: string, tokenValue: string): { name: string; value: string } | null {
    // Handle token key format like "colors.primary" -> "--primary"
    const parts = tokenKey.split('.');
    if (parts.length >= 2) {
      const [category, name] = parts;
      
      // Map common categories to CSS variable names
      const variableMap: Record<string, string> = {
        'colors.primary': '--primary',
        'colors.secondary': '--secondary',
        'colors.background': '--background',
        'colors.surface': '--surface',
        'colors.foreground': '--foreground',
        'colors.muted': '--muted',
        'colors.accent': '--accent',
        'gradients.primary': '--gradient-primary',
        'gradients.secondary': '--gradient-secondary',
        'shadows.card': '--shadow-card',
        'shadows.glow': '--shadow-glow'
      };

      const cssVarName = variableMap[tokenKey] || `--${name}`;
      return { name: cssVarName, value: tokenValue };
    }

    return null;
  }

  /**
   * Removes legacy data after successful migration
   */
  static cleanupLegacyData(): void {
    try {
      Object.values(this.LEGACY_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('Legacy theme data cleanup completed');
    } catch (error) {
      console.error('Failed to cleanup legacy data:', error);
    }
  }

  /**
   * Performs dry run of migration without making changes
   */
  static async dryRunMigration(): Promise<MigrationResult> {
    const result: MigrationResult = {
      success: false,
      migratedThemes: 0,
      migratedTokens: 0,
      errors: []
    };

    try {
      const legacyData = this.getLegacyData();

      if (legacyData.customThemes && Array.isArray(legacyData.customThemes)) {
        result.migratedThemes = legacyData.customThemes.length;
      }

      if (legacyData.customTokens && typeof legacyData.customTokens === 'object') {
        result.migratedTokens = Object.keys(legacyData.customTokens).length;
      }

      result.success = true;
    } catch (error) {
      result.errors.push(`Dry run failed: ${error}`);
    }

    return result;
  }
}