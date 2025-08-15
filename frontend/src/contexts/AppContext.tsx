import React, { createContext, useContext, ReactNode } from 'react';
import { APP_CONFIG } from '@/config/app';

interface AppContextType {
  userId: string;
  config: typeof APP_CONFIG;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const contextValue: AppContextType = {
    userId: APP_CONFIG.userId,
    config: APP_CONFIG,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Convenience hook for getting userId
export const useUserId = (): string => {
  const { userId } = useAppContext();
  return userId;
};
