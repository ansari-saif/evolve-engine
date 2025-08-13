import type { ITaskService } from '../interfaces/ITaskService';
import type { TaskCreate, TaskUpdate, TaskResponse } from '../../client/models';

/**
 * Mock implementation of ITaskService for testing
 * Follows Dependency Inversion Principle by implementing the interface
 */
export class MockTaskService implements ITaskService {
  private tasks: TaskResponse[] = [];
  private nextId = 1;

  // CRUD operations
  async createTask(task: TaskCreate): Promise<TaskResponse> {
    const newTask: TaskResponse = {
      task_id: this.nextId++,
      description: task.description,
      priority: task.priority,
      completion_status: 'Pending',
      energy_required: task.energy_required,
      estimated_duration: task.estimated_duration,
      actual_duration: null,
      scheduled_for_date: task.scheduled_for_date,
      started_at: null,
      completed_at: null,
      goal_id: task.goal_id,
      ai_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    this.tasks.push(newTask);
    return newTask;
  }

  async getTask(taskId: number): Promise<TaskResponse> {
    const task = this.tasks.find(t => t.task_id === taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    return task;
  }

  async updateTask(taskId: number, updates: TaskUpdate): Promise<TaskResponse> {
    const taskIndex = this.tasks.findIndex(t => t.task_id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    this.tasks[taskIndex] = {
      ...this.tasks[taskIndex],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    
    return this.tasks[taskIndex];
  }

  async deleteTask(taskId: number): Promise<void> {
    const taskIndex = this.tasks.findIndex(t => t.task_id === taskId);
    if (taskIndex === -1) {
      throw new Error(`Task with ID ${taskId} not found`);
    }
    
    this.tasks.splice(taskIndex, 1);
  }

  // Bulk operations
  async createBulkTasks(tasks: TaskCreate[]): Promise<TaskResponse[]> {
    const createdTasks: TaskResponse[] = [];
    
    for (const task of tasks) {
      const createdTask = await this.createTask(task);
      createdTasks.push(createdTask);
    }
    
    return createdTasks;
  }

  async updateBulkTasks(updates: Array<{ taskId: number; updates: TaskUpdate }>): Promise<TaskResponse[]> {
    const updatedTasks: TaskResponse[] = [];
    
    for (const { taskId, updates: taskUpdates } of updates) {
      const updatedTask = await this.updateTask(taskId, taskUpdates);
      updatedTasks.push(updatedTask);
    }
    
    return updatedTasks;
  }

  async deleteBulkTasks(taskIds: number[]): Promise<void> {
    for (const taskId of taskIds) {
      await this.deleteTask(taskId);
    }
  }

  // Query operations
  async getUserTasks(userId: string): Promise<TaskResponse[]> {
    // Mock implementation - return all tasks
    return [...this.tasks];
  }

  async getTasksByGoal(goalId: number): Promise<TaskResponse[]> {
    return this.tasks.filter(task => task.goal_id === goalId);
  }

  async getTasksByStatus(status: string): Promise<TaskResponse[]> {
    return this.tasks.filter(task => task.completion_status === status);
  }

  async getTasksByPriority(priority: string): Promise<TaskResponse[]> {
    return this.tasks.filter(task => task.priority === priority);
  }

  // Special operations
  async completeTask(taskId: number): Promise<TaskResponse> {
    return this.updateTask(taskId, {
      completion_status: 'Completed',
      completed_at: new Date().toISOString(),
    });
  }

  async startTask(taskId: number): Promise<TaskResponse> {
    return this.updateTask(taskId, {
      completion_status: 'In Progress',
      started_at: new Date().toISOString(),
    });
  }

  async pauseTask(taskId: number): Promise<TaskResponse> {
    return this.updateTask(taskId, {
      completion_status: 'Pending',
    });
  }

  // Search and filtering
  async searchTasks(query: string, userId: string): Promise<TaskResponse[]> {
    const lowercaseQuery = query.toLowerCase();
    return this.tasks.filter(task =>
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  }

  async filterTasks(filters: {
    status?: string;
    priority?: string;
    energy?: string;
    goalId?: number;
    dateRange?: { start: string; end: string };
  }, userId: string): Promise<TaskResponse[]> {
    return this.tasks.filter(task => {
      if (filters.status && task.completion_status !== filters.status) return false;
      if (filters.priority && task.priority !== filters.priority) return false;
      if (filters.energy && task.energy_required !== filters.energy) return false;
      if (filters.goalId && task.goal_id !== filters.goalId) return false;
      return true;
    });
  }

  // Analytics and statistics
  async getTaskStatistics(userId: string): Promise<{
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    completionRate: number;
  }> {
    const total = this.tasks.length;
    const pending = this.tasks.filter(t => t.completion_status === 'Pending').length;
    const inProgress = this.tasks.filter(t => t.completion_status === 'In Progress').length;
    const completed = this.tasks.filter(t => t.completion_status === 'Completed').length;
    
    return {
      total,
      pending,
      inProgress,
      completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  }

  // Validation
  async validateTask(task: TaskCreate): Promise<{
    isValid: boolean;
    errors: Record<string, string>;
    warnings: Record<string, string>;
  }> {
    const errors: Record<string, string> = {};
    const warnings: Record<string, string> = {};

    if (!task.description?.trim()) {
      errors.description = 'Task description is required';
    }

    if (!task.priority) {
      errors.priority = 'Task priority is required';
    }

    if (!task.energy_required) {
      errors.energy_required = 'Energy level is required';
    }

    if (task.description && task.description.length < 3) {
      warnings.description = 'Task description is very short';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      warnings,
    };
  }

  // Helper method for testing
  setTasks(tasks: TaskResponse[]): void {
    this.tasks = [...tasks];
    this.nextId = Math.max(...tasks.map(t => t.task_id), 0) + 1;
  }

  // Helper method for testing
  clearTasks(): void {
    this.tasks = [];
    this.nextId = 1;
  }
}
