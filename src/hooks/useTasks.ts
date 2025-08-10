import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { TasksService } from '../client';
import { getErrorMessage } from '../utils/errorHandling';
import type { TaskResponse, TaskCreate, TaskUpdate, BulkTaskCreate } from '../client/models';

// Individual query hooks
export const useGetTasks = () => {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await TasksService.readTasksTasksGet();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetTask = (id: number) => {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: async () => {
      const response = await TasksService.readTaskTasksTaskIdGet({ taskId: id });
      return response;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks', 'user', userId],
    queryFn: async () => {
      const response = await TasksService.getUserTasksTasksUserUserIdGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetUserPendingTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks', 'user', userId, 'pending'],
    queryFn: async () => {
      const response = await TasksService.getUserPendingTasksTasksUserUserIdPendingGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

export const useGetUserTodayTasks = (userId: string) => {
  return useQuery({
    queryKey: ['tasks', 'user', userId, 'today'],
    queryFn: async () => {
      const response = await TasksService.getUserTodayTasksTasksUserUserIdTodayGet({ userId });
      return response;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Mutation hooks
export const useCreateTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (taskData: TaskCreate) => {
      const response = await TasksService.createTaskTasksPost({ requestBody: taskData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Failed to create task:', getErrorMessage(error));
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  
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
      console.error('Failed to update task:', getErrorMessage(error));
    },
  });
};

export const useCompleteTask = () => {
  const queryClient = useQueryClient();
  
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
      console.error('Failed to complete task:', getErrorMessage(error));
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await TasksService.deleteTaskTasksTaskIdDelete({ taskId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Failed to delete task:', getErrorMessage(error));
    },
  });
};

export const useCreateBulkTasks = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (tasksData: BulkTaskCreate) => {
      const response = await TasksService.createBulkTasksTasksBulkPost({ requestBody: tasksData });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
    onError: (error) => {
      console.error('Failed to create bulk tasks:', getErrorMessage(error));
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
