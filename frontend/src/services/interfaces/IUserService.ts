/**
 * Interface for user service operations
 * Follows Dependency Inversion Principle by defining abstraction
 */
export interface IUserService {
  // User management
  getUser(userId: string): Promise<{
    userId: string;
    email: string;
    name: string;
    preferences: Record<string, unknown>;
    settings: Record<string, unknown>;
  }>;
  
  updateUser(userId: string, updates: {
    name?: string;
    email?: string;
    preferences?: Record<string, unknown>;
    settings?: Record<string, unknown>;
  }): Promise<void>;
  
  // Authentication and authorization
  authenticateUser(credentials: {
    email: string;
    password: string;
  }): Promise<{
    userId: string;
    token: string;
    refreshToken: string;
    expiresAt: string;
  }>;
  
  refreshToken(refreshToken: string): Promise<{
    token: string;
    refreshToken: string;
    expiresAt: string;
  }>;
  
  logoutUser(userId: string): Promise<void>;
  
  // User preferences
  getUserPreferences(userId: string): Promise<{
    theme: string;
    language: string;
    notifications: boolean;
    autoSave: boolean;
    timezone: string;
    customSettings: Record<string, unknown>;
  }>;
  
  updateUserPreferences(userId: string, preferences: Record<string, unknown>): Promise<void>;
  
  // User statistics and analytics
  getUserStatistics(userId: string): Promise<{
    totalTasks: number;
    completedTasks: number;
    totalGoals: number;
    completedGoals: number;
    productivityScore: number;
    streakDays: number;
    lastActive: string;
  }>;
  
  // User activity tracking
  trackUserActivity(userId: string, activity: {
    action: string;
    component: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;
  
  getUserActivity(userId: string, dateRange?: {
    start: string;
    end: string;
  }): Promise<Array<{
    action: string;
    component: string;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>>;
  
  // User validation
  validateUser(userId: string): Promise<{
    isValid: boolean;
    errors: Record<string, string>;
    warnings: Record<string, string>;
  }>;
}
