// App configuration
export const APP_CONFIG = {
  // User configuration
  userId: import.meta.env.VITE_USER_ID || '5976080378',
  
  // API configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  
  // WebSocket configuration
  webSocketUrl: import.meta.env.VITE_WEBSOCKET_URL || (() => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    return baseUrl.replace(/^https?/, (match) => match === 'https' ? 'wss' : 'ws');
  })(),
  
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
