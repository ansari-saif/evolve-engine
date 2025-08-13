import { useMemo } from 'react';
import type { TaskResponse } from '../client/models';
import type { TaskFilter } from '../types/app';

/**
 * Custom hook for task filtering logic
 * Follows Single Responsibility Principle by handling only filtering concerns
 */
export const useTaskFiltering = (tasks: TaskResponse[] | undefined, filters: TaskFilter) => {
  const filteredTasks = useMemo(() => {
    if (!tasks) return [];
    
    return tasks.filter(task => {
      // Filter by status
      if (filters.status !== 'All' && task.completion_status !== filters.status) {
        return false;
      }
      
      // Filter by priority
      if (filters.priority !== 'All' && task.priority !== filters.priority) {
        return false;
      }
      
      // Filter by energy level
      if (filters.energy !== 'All' && task.energy_required !== filters.energy) {
        return false;
      }
      
      // Filter by goal
      if (filters.goal !== 'All' && task.goal_id !== filters.goal) {
        return false;
      }
      
      return true;
    });
  }, [tasks, filters]);

  return filteredTasks;
};
