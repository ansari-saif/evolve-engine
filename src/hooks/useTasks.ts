import { useMutation, useQuery, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { TasksService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import { useErrorHandler } from './useErrorHandler';
import type { TaskResponse, TaskCreate, TaskUpdate, BulkTaskCreate } from '../client/models';

// Individual query hooks
export const useGetTasks = (): UseQueryResult<TaskResponse[], Error> => {
  const { createRetryConfig } = useErrorHandler();
  
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await TasksService.readTasksTasksGet();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...createRetryConfig(2, 1000),
  });
};

export const useGetTask = (id: number): UseQueryResult<TaskResponse, Error> => {
  const { createRetryConfig } = useErrorHandler();
  
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const response = await TasksService.readTaskTasksTaskIdGet({ taskId: id });
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...createRetryConfig(2, 1000),
  });
};

export const useGetUserTasks = (userId: string): UseQueryResult<TaskResponse[], Error> => {
  const { createRetryConfig } = useErrorHandler();
  
  return useQuery({
    queryKey: ['tasks', 'user', userId],
    queryFn: async () => {
      const response = await TasksService.getUserTasksTasksUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    ...createRetryConfig(2, 1000),
  });
};

export const useGetUserPendingTasks = (userId: string): UseQueryResult<TaskResponse[], Error> => {
  const { createRetryConfig } = useErrorHandler();
  
  return useQuery({
    queryKey: ['tasks', 'user', userId, 'pending'],
    queryFn: async () => {
      const response = await TasksService.getUserPendingTasksTasksUserUserIdPendingGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...createRetryConfig(2, 1000),
  });
};

export const useGetUserTodayTasks = (userId: string): UseQueryResult<TaskResponse[], Error> => {
  const { createRetryConfig } = useErrorHandler();
  
  return useQuery({
    queryKey: ['tasks', 'user', userId, 'today'],
    queryFn: async () => {
      const response = await TasksService.getUserTodayTasksTasksUserUserIdTodayGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    ...createRetryConfig(2, 1000),
  });
};

// Mutation hooks
export const useCreateTask = (): UseMutationResult<TaskResponse, Error, TaskCreate, unknown> => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (taskData: TaskCreate) => {
      const response = await TasksService.createTaskTasksPost({ requestBody: taskData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      handleError(error, {
        showToast: true,
        toastTitle: 'Failed to create task',
      });
    },
  });
};

export const useUpdateTask = (): UseMutationResult<TaskResponse, Error, { id: number; data: TaskUpdate }, unknown> => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TaskUpdate }) => {
      const response = await TasksService.updateTaskTasksTaskIdPut({ 
        taskId: id, 
        requestBody: data 
      });
      return response;
    },
    onMutate: async ({ id, data }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['tasks', id] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);
      const previousTask = queryClient.getQueryData(['tasks', id]);

      // Optimistically update to the new value
      queryClient.setQueryData(['tasks'], (old: TaskResponse[] | undefined) => {
        if (!old) return old;
        return old.map(task => task.task_id === id ? { ...task, ...data } : task);
      });
      queryClient.setQueryData(['tasks', id], (old: TaskResponse | undefined) => {
        if (!old) return old;
        return { ...old, ...data };
      });

      // Return a context object with the snapshotted value
      return { previousTasks, previousTask };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['tasks', variables.id], context.previousTask);
      }
      handleError(err, {
        showToast: true,
        toastTitle: 'Failed to update task',
      });
    },
    onSettled: (_, __, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
  });
};

export const useCompleteTask = (): UseMutationResult<TaskResponse, Error, number, unknown> => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (taskId: number) => {
      const response = await TasksService.completeTaskTasksTaskIdCompletePatch({ taskId });
      return response;
    },
    onMutate: async (taskId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      await queryClient.cancelQueries({ queryKey: ['tasks', taskId] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);
      const previousTask = queryClient.getQueryData(['tasks', taskId]);

      // Optimistically update to completed status
      const optimisticUpdate = {
        completion_status: 'Completed' as const,
        completed_at: new Date().toISOString()
      };

      queryClient.setQueryData(['tasks'], (old: TaskResponse[] | undefined) => {
        if (!old) return old;
        return old.map(task => task.task_id === taskId ? { ...task, ...optimisticUpdate } : task);
      });
      queryClient.setQueryData(['tasks', taskId], (old: TaskResponse | undefined) => {
        if (!old) return old;
        return { ...old, ...optimisticUpdate };
      });

      // Return a context object with the snapshotted value
      return { previousTasks, previousTask };
    },
    onError: (err, taskId, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      if (context?.previousTask) {
        queryClient.setQueryData(['tasks', taskId], context.previousTask);
      }
      handleError(err, {
        showToast: true,
        toastTitle: 'Failed to complete task',
      });
    },
    onSettled: (_, __, taskId) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
  });
};

export const useDeleteTask = (): UseMutationResult<void, Error, number, unknown> => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await TasksService.deleteTaskTasksTaskIdDelete({ taskId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      handleError(error, {
        showToast: true,
        toastTitle: 'Failed to delete task',
      });
    },
  });
};

export const useCreateBulkTasks = (): UseMutationResult<TaskResponse[], Error, BulkTaskCreate, unknown> => {
  const queryClient = useQueryClient();
  const { handleError } = useErrorHandler();
  
  return useMutation({
    mutationFn: async (tasksData: BulkTaskCreate) => {
      const response = await TasksService.createBulkTasksTasksBulkPost({ requestBody: tasksData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      handleError(error, {
        showToast: true,
        toastTitle: 'Failed to create bulk tasks',
      });
    },
  });
};

// Main hook that returns all the individual hooks
export const useTasks = () => {
  return {
    useGetTasks,
    useGetTask,
    useGetUserTasks,
    useGetUserPendingTasks,
    useGetUserTodayTasks,
    useCreateTask,
    useUpdateTask,
    useCompleteTask,
    useDeleteTask,
    useCreateBulkTasks,
  };
};
