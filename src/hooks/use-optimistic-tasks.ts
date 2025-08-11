import { useState, useCallback } from 'react';
import type { TaskResponse, TaskCreate } from '../client/models';

export interface OptimisticTask extends TaskResponse {
  isOptimistic: true;
  originalData?: TaskCreate;
  createdAt: number;
}

export interface OptimisticTaskState {
  optimisticTasks: OptimisticTask[];
  addOptimisticTasks: (tasks: TaskCreate[]) => void;
  confirmTask: (taskId: number, confirmedTask: TaskResponse) => void;
  removeOptimisticTask: (taskId: number) => void;
  clearOptimisticTasks: () => void;
  getOptimisticTask: (taskId: number) => OptimisticTask | undefined;
  hasOptimisticTasks: boolean;
}

export function useOptimisticTasks(): OptimisticTaskState {
  const [optimisticTasks, setOptimisticTasks] = useState<OptimisticTask[]>([]);

  const addOptimisticTasks = useCallback((tasks: TaskCreate[]) => {
    const newOptimisticTasks: OptimisticTask[] = tasks.map((task, index) => ({
      task_id: -(Date.now() + index), // Negative IDs for optimistic tasks
      description: task.description,
      priority: task.priority || 'Medium',
      completion_status: task.completion_status || 'Pending',
      energy_required: task.energy_required || 'Medium',
      estimated_duration: task.estimated_duration,
      actual_duration: null,
      scheduled_for_date: task.scheduled_for_date,
      started_at: null,
      completed_at: null,
      goal_id: task.goal_id,
      ai_generated: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      isOptimistic: true,
      originalData: task,
      createdAt: Date.now()
    }));

    setOptimisticTasks(prev => [...prev, ...newOptimisticTasks]);
  }, []);

  const confirmTask = useCallback((taskId: number, confirmedTask: TaskResponse) => {
    setOptimisticTasks(prev => 
      prev.filter(task => task.task_id !== taskId)
    );
  }, []);

  const removeOptimisticTask = useCallback((taskId: number) => {
    setOptimisticTasks(prev => 
      prev.filter(task => task.task_id !== taskId)
    );
  }, []);

  const clearOptimisticTasks = useCallback(() => {
    setOptimisticTasks([]);
  }, []);

  const getOptimisticTask = useCallback((taskId: number) => {
    return optimisticTasks.find(task => task.task_id === taskId);
  }, [optimisticTasks]);

  const hasOptimisticTasks = optimisticTasks.length > 0;

  return {
    optimisticTasks,
    addOptimisticTasks,
    confirmTask,
    removeOptimisticTask,
    clearOptimisticTasks,
    getOptimisticTask,
    hasOptimisticTasks
  };
}
