import { useState } from 'react';
import { useTheme } from '../providers/ThemeProvider';
import { useDesignSystem } from './useDesignSystem';
import { tokens } from '../theme';

export interface CustomTheme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
  };
}

export const useThemeManagement = () => {
  const { theme, setTheme, availableThemes } = useTheme();
  const {
    updateToken,
    getTokenValue,
    customTokens,
    createCustomTheme,
    deleteCustomTheme,
    applyCustomThemeById,
    customThemes,
    activeCustomTheme,
    resetToDefaultTheme,
    exportConfiguration,
    importConfiguration,
  } = useDesignSystem();

  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [tokenValue, setTokenValue] = useState('');
  const [selectedTokenCategory, setSelectedTokenCategory] = useState<string>('');

  const handleCreateCustomTheme = () => {
    createCustomTheme(`Custom Theme ${customThemes.length + 1}`, {
      primary: tokens.colors.primary.DEFAULT,
      secondary: tokens.colors.secondary.DEFAULT,
      background: tokens.colors.background,
      surface: tokens.colors.surface,
      foreground: tokens.colors.foreground,
      muted: tokens.colors.muted.DEFAULT,
      accent: tokens.colors.accent.DEFAULT
    });
  };

  const handleDeleteCustomTheme = (themeId: string) => {
    deleteCustomTheme(themeId);
  };

  const handleUpdateToken = (tokenName: string, newValue: string) => {
    if (selectedTokenCategory && tokenName) {
      updateToken(selectedTokenCategory, tokenName, newValue);
      setSelectedToken(null);
      setTokenValue('');
      setSelectedTokenCategory('');
    }
  };

  const handleExportDesignSystem = () => {
    exportConfiguration();
  };

  return {
    // Theme state
    theme,
    setTheme,
    availableThemes,
    customThemes,
    activeCustomTheme,
    
    // Token state
    selectedToken,
    setSelectedToken,
    tokenValue,
    setTokenValue,
    selectedTokenCategory,
    setSelectedTokenCategory,
    
    // Token operations
    updateToken,
    getTokenValue,
    customTokens,
    
    // Theme operations
    createCustomTheme: handleCreateCustomTheme,
    deleteCustomTheme: handleDeleteCustomTheme,
    applyCustomThemeById,
    resetToDefaultTheme,
    exportConfiguration: handleExportDesignSystem,
    importConfiguration,
    
    // Token operations
    updateTokenValue: handleUpdateToken,
  };
};
