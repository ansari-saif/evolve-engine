// App configuration
export const APP_CONFIG = {
  // User configuration
  userId: import.meta.env.VITE_USER_ID || '5976080378',
  
  // API configuration
  apiBaseUrl: import.meta.env.VITE_API_URL,
  
  // WebSocket configuration
  webSocketUrl: 'ws://34.131.94.242:8000',
  
  // App settings
  appName: 'Evolve Engine',
  version: '1.0.0',
} as const;

// Type for the config
export type AppConfig = typeof APP_CONFIG;

// Helper function to get config value
export const getConfig = <K extends keyof AppConfig>(key: K): AppConfig[K] => {
  return APP_CONFIG[key];
};
