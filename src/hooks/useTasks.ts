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
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', variables.id] });
    },
    onError: (error) => {
      handleError(error, {
        showToast: true,
        toastTitle: 'Failed to update task',
      });
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
    onSuccess: (_, taskId) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['tasks', taskId] });
    },
    onError: (error) => {
      handleError(error, {
        showToast: true,
        toastTitle: 'Failed to complete task',
      });
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
