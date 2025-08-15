import type { TaskCreate, TaskUpdate, TaskResponse } from '../../client/models';

/**
 * Interface for task service operations
 * Follows Dependency Inversion Principle by defining abstraction
 */
export interface ITaskService {
  // CRUD operations
  createTask(task: TaskCreate): Promise<TaskResponse>;
  getTask(taskId: number): Promise<TaskResponse>;
  updateTask(taskId: number, updates: TaskUpdate): Promise<TaskResponse>;
  deleteTask(taskId: number): Promise<void>;
  
  // Bulk operations
  createBulkTasks(tasks: TaskCreate[]): Promise<TaskResponse[]>;
  updateBulkTasks(updates: Array<{ taskId: number; updates: TaskUpdate }>): Promise<TaskResponse[]>;
  deleteBulkTasks(taskIds: number[]): Promise<void>;
  
  // Query operations
  getUserTasks(userId: string): Promise<TaskResponse[]>;
  getTasksByGoal(goalId: number): Promise<TaskResponse[]>;
  getTasksByStatus(status: string): Promise<TaskResponse[]>;
  getTasksByPriority(priority: string): Promise<TaskResponse[]>;
  
  // Special operations
  completeTask(taskId: number): Promise<TaskResponse>;
  startTask(taskId: number): Promise<TaskResponse>;
  pauseTask(taskId: number): Promise<TaskResponse>;
  
  // Search and filtering
  searchTasks(query: string, userId: string): Promise<TaskResponse[]>;
  filterTasks(filters: {
    status?: string;
    priority?: string;
    energy?: string;
    goalId?: number;
    dateRange?: { start: string; end: string };
  }, userId: string): Promise<TaskResponse[]>;
  
  // Analytics and statistics
  getTaskStatistics(userId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  }>;
  
  // Validation
  validateTask(task: TaskCreate): Promise<{
    isValid: boolean;
    errors: Record<string, string>;
    warnings: Record<string, string>;
  }>;
}
