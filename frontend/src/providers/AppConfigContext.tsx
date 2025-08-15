import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface AppConfig {
  userId: string;
  apiBaseUrl: string;
  webSocketUrl: string;
  environment: 'development' | 'staging' | 'production';
  features: {
    aiGeneration: boolean;
    realTimeUpdates: boolean;
    analytics: boolean;
    notifications: boolean;
  };
  limits: {
    maxTasksPerUser: number;
    maxGoalsPerUser: number;
    maxFileSize: number;
  };
}

interface AppConfigContextType {
  // Config state
  config: AppConfig;
  isLoading: boolean;
  
  // Config actions
  updateConfig: (updates: Partial<AppConfig>) => void;
  updateFeature: (feature: keyof AppConfig['features'], enabled: boolean) => void;
  updateLimit: (limit: keyof AppConfig['limits'], value: number) => void;
  
  // Config utilities
  isFeatureEnabled: (feature: keyof AppConfig['features']) => boolean;
  getLimit: (limit: keyof AppConfig['limits']) => number;
  isDevelopment: () => boolean;
  isProduction: () => boolean;
}

const AppConfigContext = createContext<AppConfigContextType | undefined>(undefined);

interface AppConfigProviderProps {
  children: ReactNode;
  initialConfig?: Partial<AppConfig>;
}

const defaultConfig: AppConfig = {
  userId: '',
  apiBaseUrl: process.env.VITE_API_URL,
  webSocketUrl: 'ws://34.131.94.242:8000/ws',
  environment: (process.env.NODE_ENV as AppConfig['environment']) || 'development',
  features: {
    aiGeneration: true,
    realTimeUpdates: true,
    analytics: false,
    notifications: true,
  },
  limits: {
    maxTasksPerUser: 1000,
    maxGoalsPerUser: 100,
    maxFileSize: 10 * 1024 * 1024, // 10MB
  },
};

export const AppConfigProvider: React.FC<AppConfigProviderProps> = ({ 
  children, 
  initialConfig = {} 
}) => {
  const [config, setConfig] = useState<AppConfig>({
    ...defaultConfig,
    ...initialConfig,
  });
  const [isLoading, setIsLoading] = useState(false);

  const updateConfig = useCallback((updates: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  }, []);

  const updateFeature = useCallback((feature: keyof AppConfig['features'], enabled: boolean) => {
    setConfig(prev => ({
      ...prev,
      features: { ...prev.features, [feature]: enabled }
    }));
  }, []);

  const updateLimit = useCallback((limit: keyof AppConfig['limits'], value: number) => {
    setConfig(prev => ({
      ...prev,
      limits: { ...prev.limits, [limit]: value }
    }));
  }, []);

  const isFeatureEnabled = useCallback((feature: keyof AppConfig['features']) => {
    return config.features[feature];
  }, [config.features]);

  const getLimit = useCallback((limit: keyof AppConfig['limits']) => {
    return config.limits[limit];
  }, [config.limits]);

  const isDevelopment = useCallback(() => {
    return config.environment === 'development';
  }, [config.environment]);

  const isProduction = useCallback(() => {
    return config.environment === 'production';
  }, [config.environment]);

  const value: AppConfigContextType = {
    config,
    isLoading,
    updateConfig,
    updateFeature,
    updateLimit,
    isFeatureEnabled,
    getLimit,
    isDevelopment,
    isProduction,
  };

  return (
    <AppConfigContext.Provider value={value}>
      {children}
    </AppConfigContext.Provider>
  );
};

export const useAppConfig = (): AppConfigContextType => {
  const context = useContext(AppConfigContext);
  if (context === undefined) {
    throw new Error('useAppConfig must be used within an AppConfigProvider');
  }
  return context;
};

// Hook for accessing only config state
export const useAppConfigState = () => {
  const { config, isLoading } = useAppConfig();
  return { config, isLoading };
};

// Hook for accessing only config actions
export const useAppConfigActions = () => {
  const { updateConfig, updateFeature, updateLimit } = useAppConfig();
  return { updateConfig, updateFeature, updateLimit };
};

// Hook for accessing only config utilities
export const useAppConfigUtils = () => {
  const { isFeatureEnabled, getLimit, isDevelopment, isProduction } = useAppConfig();
  return { isFeatureEnabled, getLimit, isDevelopment, isProduction };
};
