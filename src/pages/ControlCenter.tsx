/**
 * Control Center - Design System Management Dashboard
 * 
 * A comprehensive interface for managing themes, viewing design tokens,
 * and controlling various aspects of the application.
 */

import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ThemeSelector } from '../components/ui/theme-selector';
import { 
  Settings, 
  Download,
  Palette, 
  Layers, 
  Eye, 
  Zap
} from 'lucide-react';

// Custom hooks
import { useThemeManagement } from '../hooks/useThemeManagement';
import { useControlCenterState } from '../hooks/useControlCenterState';

// Tab components
import { ControlCenterTabs } from '../components/control-center/ControlCenterTabs';
import { OverviewTab } from '../components/control-center/OverviewTab';
import { TokensTab } from '../components/control-center/TokensTab';
import { ThemesTab } from '../components/control-center/ThemesTab';
import { ComponentsTab } from '../components/control-center/ComponentsTab';
import { SettingsTab } from '../components/control-center/SettingsTab';

const ControlCenter: React.FC = () => {
  const startTime = performance.now();
  
  // Custom hooks for state management
  const {
    theme,
    availableThemes,
    customThemes,
    activeCustomTheme,
    selectedToken,
    setSelectedToken,
    tokenValue,
    setTokenValue,
    selectedTokenCategory,
    setSelectedTokenCategory,
    getTokenValue,
    createCustomTheme,
    deleteCustomTheme,
    applyCustomThemeById,
    resetToDefaultTheme,
    exportConfiguration,
    importConfiguration,
    updateTokenValue,
    updateCustomThemeColor,
    renameCustomTheme,
  } = useThemeManagement();

  const {
    activeTab,
    setActiveTab,
    copiedToken,
    copyToClipboard,
  } = useControlCenterState();

  // File input ref for theme import
  const importFileInputRef = useRef<HTMLInputElement>(null);

  // Performance tracking
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    if (renderTime > 16) {
      console.warn(`Slow render detected in ControlCenter: ${renderTime.toFixed(2)}ms`);
    }
  }, [startTime]);

  // Token categories configuration
  const tokenCategories = [
    {
      name: 'Colors',
      icon: <Palette className="w-4 h-4" />,
      tokens: [
        { name: 'Primary', value: getTokenValue('colors', 'Primary'), editable: true },
        { name: 'Secondary', value: getTokenValue('colors', 'Secondary'), editable: true },
        { name: 'Success', value: getTokenValue('colors', 'Success'), editable: true },
        { name: 'Warning', value: getTokenValue('colors', 'Warning'), editable: true },
        { name: 'Danger', value: getTokenValue('colors', 'Danger'), editable: true },
        { name: 'Background', value: getTokenValue('colors', 'Background'), editable: true },
        { name: 'Surface', value: getTokenValue('colors', 'Surface'), editable: true },
      ]
    },
    {
      name: 'Gradients',
      icon: <Layers className="w-4 h-4" />,
      tokens: [
        { name: 'Primary', value: getTokenValue('gradients', 'Primary'), editable: true },
        { name: 'Motivation', value: getTokenValue('gradients', 'Motivation'), editable: true },
        { name: 'Success', value: getTokenValue('gradients', 'Success'), editable: true },
        { name: 'Warning', value: getTokenValue('gradients', 'Warning'), editable: true },
        { name: 'Subtle', value: getTokenValue('gradients', 'Subtle'), editable: true },
      ]
    },
    {
      name: 'Shadows',
      icon: <Eye className="w-4 h-4" />,
      tokens: [
        { name: 'Elegant', value: getTokenValue('shadows', 'Elegant'), editable: true },
        { name: 'Glow', value: getTokenValue('shadows', 'Glow'), editable: true },
        { name: 'Card', value: getTokenValue('shadows', 'Card'), editable: true },
      ]
    },
    {
      name: 'Animations',
      icon: <Zap className="w-4 h-4" />,
      tokens: [
        { name: 'Smooth', value: getTokenValue('animations', 'Smooth'), editable: true },
        { name: 'Spring', value: getTokenValue('animations', 'Spring'), editable: true },
      ]
    }
  ];

  // Event handlers
  const handleSelectToken = (tokenName: string, value: string) => {
    setSelectedToken(tokenName);
    setTokenValue(value);
    setSelectedTokenCategory('colors'); // Default category, could be improved
  };

  const handleTokenValueChange = (value: string) => {
    setTokenValue(value);
  };

  const handleUpdateToken = (tokenName: string, newValue: string) => {
    updateTokenValue(tokenName, newValue);
  };

  const handleCopyToken = (text: string, tokenName: string) => {
    copyToClipboard(text, tokenName);
  };

  const handleCreateCustomTheme = () => {
    createCustomTheme();
  };

  const handleDeleteCustomTheme = (themeId: string) => {
    deleteCustomTheme(themeId);
  };

  const handleApplyCustomTheme = (themeId: string) => {
    applyCustomThemeById(themeId);
  };

  const handleResetToDefault = () => {
    resetToDefaultTheme();
  };

  const handleExportDesignSystem = () => {
    exportConfiguration();
  };

  const handleImportConfiguration = () => {
    importFileInputRef.current?.click();
  };

  const handleImportFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      importConfiguration(file);
    }
    // reset value to allow re-uploading the same file later
    if (importFileInputRef.current) importFileInputRef.current.value = '';
  };

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab 
            availableThemes={availableThemes}
            customThemes={customThemes}
          />
        );
      case 'tokens':
        return (
          <TokensTab
            tokenCategories={tokenCategories}
            copiedToken={copiedToken}
            selectedToken={selectedToken}
            tokenValue={tokenValue}
            onCopyToken={handleCopyToken}
            onSelectToken={handleSelectToken}
            onUpdateToken={handleUpdateToken}
            onTokenValueChange={handleTokenValueChange}
          />
        );
      case 'themes':
        return (
          <ThemesTab
            availableThemes={availableThemes}
            customThemes={customThemes}
            activeCustomTheme={activeCustomTheme}
            onCreateCustomTheme={handleCreateCustomTheme}
            onDeleteCustomTheme={handleDeleteCustomTheme}
            onApplyCustomTheme={handleApplyCustomTheme}
            onResetToDefault={handleResetToDefault}
            onExportConfiguration={handleExportDesignSystem}
            onImportConfiguration={handleImportConfiguration}
            updateCustomThemeColor={updateCustomThemeColor}
            updateCustomThemeName={renameCustomTheme}
          />
        );
      case 'components':
        return <ComponentsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8" role="main" aria-labelledby="control-center-heading">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3" id="control-center-heading">
              <Settings className="w-8 h-8 text-primary" />
              Control Center
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage themes, view design tokens, and control application features
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={handleExportDesignSystem} variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <ThemeSelector variant="outline" />
            <Badge variant="secondary" className="text-xs">
              {theme} mode
            </Badge>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <ControlCenterTabs 
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {renderTabContent()}
        </motion.div>
        {/* Hidden file input for importing themes */}
        <input
          ref={importFileInputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={handleImportFileChange}
        />
      </div>
    </div>
  );
};

export default ControlCenter;
