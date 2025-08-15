import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface UserContextType {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // User actions
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // User utilities
  hasPermission: (permission: string) => boolean;
  isOwner: (resourceUserId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

export const UserProvider: React.FC<UserProviderProps> = ({ 
  children, 
  initialUser = null 
}) => {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  }, [user]);

  const updatePreferences = useCallback((preferences: Partial<UserPreferences>) => {
    if (user) {
      setUser({
        ...user,
        preferences: { ...user.preferences, ...preferences }
      });
    }
  }, [user]);

  const hasPermission = useCallback((permission: string) => {
    // Implement permission checking logic
    return user !== null; // Simplified for now
  }, [user]);

  const isOwner = useCallback((resourceUserId: string) => {
    return user?.id === resourceUserId;
  }, [user]);

  const value: UserContextType = {
    user,
    isAuthenticated: user !== null,
    isLoading,
    login,
    logout,
    updateUser,
    updatePreferences,
    hasPermission,
    isOwner,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

// Hook for accessing only user state
export const useUserState = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  return { user, isAuthenticated, isLoading };
};

// Hook for accessing only user actions
export const useUserActions = () => {
  const { login, logout, updateUser, updatePreferences } = useUser();
  return { login, logout, updateUser, updatePreferences };
};

// Hook for accessing only user utilities
export const useUserUtils = () => {
  const { hasPermission, isOwner } = useUser();
  return { hasPermission, isOwner };
};
