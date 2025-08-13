import type { GoalCreate, GoalUpdate, GoalResponse } from '../../client/models';

/**
 * Interface for goal service operations
 * Follows Dependency Inversion Principle by defining abstraction
 */
export interface IGoalService {
  // CRUD operations
  createGoal(goal: GoalCreate): Promise<GoalResponse>;
  getGoal(goalId: number): Promise<GoalResponse>;
  updateGoal(goalId: number, updates: GoalUpdate): Promise<GoalResponse>;
  deleteGoal(goalId: number): Promise<void>;
  
  // Bulk operations
  createBulkGoals(goals: GoalCreate[]): Promise<GoalResponse[]>;
  updateBulkGoals(updates: Array<{ goalId: number; updates: GoalUpdate }>): Promise<GoalResponse[]>;
  deleteBulkGoals(goalIds: number[]): Promise<void>;
  
  // Query operations
  getUserGoals(userId: string): Promise<GoalResponse[]>;
  getGoalsByType(type: string): Promise<GoalResponse[]>;
  getGoalsByPhase(phase: string): Promise<GoalResponse[]>;
  getGoalsByPriority(priority: string): Promise<GoalResponse[]>;
  
  // Special operations
  advanceGoalPhase(goalId: number): Promise<GoalResponse>;
  setGoalProgress(goalId: number, progress: number): Promise<GoalResponse>;
  archiveGoal(goalId: number): Promise<GoalResponse>;
  
  // Search and filtering
  searchGoals(query: string, userId: string): Promise<GoalResponse[]>;
  filterGoals(filters: {
    type?: string;
    priority?: string;
    phase?: string;
    dateRange?: { start: string; end: string };
  }, userId: string): Promise<GoalResponse[]>;
  
  // Analytics and statistics
  getGoalStatistics(userId: string): Promise<{
    total: number;
    research: number;
    planning: number;
    execution: number;
    review: number;
    completed: number;
    completionRate: number;
  }>;
  
  // Validation
  validateGoal(goal: GoalCreate): Promise<{
    isValid: boolean;
    errors: Record<string, string>;
    warnings: Record<string, string>;
  }>;
}
