import React, { createContext, useContext, ReactNode } from 'react';
import type { ITaskService } from '../services/interfaces/ITaskService';
import type { IGoalService } from '../services/interfaces/IGoalService';
import type { IUserService } from '../services/interfaces/IUserService';

/**
 * Service context interface
 * Follows Dependency Inversion Principle by providing abstraction layer
 */
interface ServiceContextType {
  taskService: ITaskService;
  goalService: IGoalService;
  userService: IUserService;
}

// Create the context
const ServiceContext = createContext<ServiceContextType | undefined>(undefined);

/**
 * Service provider props interface
 */
interface ServiceProviderProps {
  children: ReactNode;
  taskService: ITaskService;
  goalService: IGoalService;
  userService: IUserService;
}

/**
 * Service provider component
 * Implements dependency injection pattern
 */
export const ServiceProvider: React.FC<ServiceProviderProps> = ({
  children,
  taskService,
  goalService,
  userService,
}) => {
  const value: ServiceContextType = {
    taskService,
    goalService,
    userService,
  };

  return (
    <ServiceContext.Provider value={value}>
      {children}
    </ServiceContext.Provider>
  );
};

/**
 * Custom hook to use services
 * Provides type-safe access to injected services
 */
export const useServices = (): ServiceContextType => {
  const context = useContext(ServiceContext);
  
  if (context === undefined) {
    throw new Error('useServices must be used within a ServiceProvider');
  }
  
  return context;
};

/**
 * Custom hook to use task service specifically
 */
export const useTaskService = (): ITaskService => {
  const { taskService } = useServices();
  return taskService;
};

/**
 * Custom hook to use goal service specifically
 */
export const useGoalService = (): IGoalService => {
  const { goalService } = useServices();
  return goalService;
};

/**
 * Custom hook to use user service specifically
 */
export const useUserService = (): IUserService => {
  const { userService } = useServices();
  return userService;
};
