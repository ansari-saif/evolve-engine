import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import type { TaskResponse, TaskUpdate, CompletionStatusEnum } from '../client/models';

export const useOptimisticUpdates = () => {
  const queryClient = useQueryClient();

  const optimisticTaskUpdate = useCallback((
    taskId: number,
    updates: Partial<TaskUpdate>,
    queryKeys: string[][] = [['tasks']]
  ) => {
    // Update all relevant query keys
    queryKeys.forEach(queryKey => {
      queryClient.setQueryData(queryKey, (oldData: TaskResponse[] | undefined) => {
        if (!oldData) return oldData;
        
        return oldData.map(task => 
          task.task_id === taskId 
            ? { ...task, ...updates }
            : task
        );
      });
    });

    // Also update individual task query
    queryClient.setQueryData(['tasks', taskId], (oldData: TaskResponse | undefined) => {
      if (!oldData) return oldData;
      return { ...oldData, ...updates };
    });
  }, [queryClient]);

  const optimisticTaskStatusChange = useCallback((
    taskId: number,
    status: CompletionStatusEnum
  ) => {
    optimisticTaskUpdate(taskId, { completion_status: status });
  }, [optimisticTaskUpdate]);

  const optimisticTaskComplete = useCallback((taskId: number) => {
    optimisticTaskUpdate(taskId, { 
      completion_status: 'Completed',
      completed_at: new Date().toISOString()
    });
  }, [optimisticTaskUpdate]);

  const optimisticTaskDelete = useCallback((taskId: number) => {
    const queryKeys = [['tasks'], ['tasks', 'user'], ['tasks', 'user', 'pending'], ['tasks', 'user', 'today']];
    
    queryKeys.forEach(queryKey => {
      queryClient.setQueryData(queryKey, (oldData: TaskResponse[] | undefined) => {
        if (!oldData) return oldData;
        return oldData.filter(task => task.task_id !== taskId);
      });
    });

    // Remove individual task query
    queryClient.removeQueries({ queryKey: ['tasks', taskId] });
  }, [queryClient]);

  return {
    optimisticTaskUpdate,
    optimisticTaskStatusChange,
    optimisticTaskComplete,
    optimisticTaskDelete,
  };
};
