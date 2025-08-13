import { useState } from 'react';

export interface AppSettings {
  notifications: boolean;
  soundEnabled: boolean;
  autoSave: boolean;
  performanceMode: boolean;
  mobileOptimized: boolean;
  darkModeAuto: boolean;
}

export const useAppSettings = () => {
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    soundEnabled: true,
    autoSave: true,
    performanceMode: false,
    mobileOptimized: false,
    darkModeAuto: false,
  });

  const updateSetting = <K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetToDefaults = () => {
    setSettings({
      notifications: true,
      soundEnabled: true,
      autoSave: true,
      performanceMode: false,
      mobileOptimized: false,
      darkModeAuto: false,
    });
  };

  const toggleSetting = <K extends keyof AppSettings>(key: K) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const getSettingsSummary = () => {
    const enabledCount = Object.values(settings).filter(Boolean).length;
    const totalCount = Object.keys(settings).length;
    return `${enabledCount}/${totalCount} settings enabled`;
  };

  return {
    settings,
    updateSetting,
    resetToDefaults,
    toggleSetting,
    getSettingsSummary,
  };
};
