import { useMemo } from 'react';
import type { TaskResponse } from '../client/models';

/**
 * Custom hook for task sorting logic
 * Follows Single Responsibility Principle by handling only sorting concerns
 */
export const useTaskSorting = (tasks: TaskResponse[]) => {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      // Sort by priority first
      const priorityOrder = { 'Urgent': 0, 'High': 1, 'Medium': 2, 'Low': 3 };
      const aPriority = priorityOrder[a.priority || 'Medium'];
      const bPriority = priorityOrder[b.priority || 'Medium'];
      
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Then sort by scheduled date
      if (a.scheduled_for_date && b.scheduled_for_date) {
        return new Date(a.scheduled_for_date).getTime() - new Date(b.scheduled_for_date).getTime();
      }
      
      // Finally sort by creation date
      return new Date(a.created_at || '').getTime() - new Date(b.created_at || '').getTime();
    });
  }, [tasks]);

  return sortedTasks;
};
