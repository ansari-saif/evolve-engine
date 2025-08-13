// Simple logger that respects environment
const isDevelopment = import.meta.env.DEV;

export const logger = {
  info: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.log(`[INFO] ${message}`, ...args);
    }
  },
  
  warn: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  },
  
  error: (message: string, ...args: unknown[]) => {
    // Always log errors, even in production
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: unknown[]) => {
    if (isDevelopment) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};