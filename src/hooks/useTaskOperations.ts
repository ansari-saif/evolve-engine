import { useCallback } from 'react';
import { useCreateTask, useUpdateTask, useCompleteTask, useDeleteTask, useCreateBulkTasks } from './useTasks';
import { useToasts } from './redux/useToasts';
import type { TaskCreate, TaskUpdate, TaskResponse } from '../client/models';

/**
 * Custom hook for task CRUD operations
 * Follows Single Responsibility Principle by handling only task operations
 */
export const useTaskOperations = (userId: string) => {
  const { showSuccessToast, showErrorToast } = useToasts();
  
  // Mutations
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const completeTaskMutation = useCompleteTask();
  const deleteTaskMutation = useDeleteTask();
  const createBulkTasksMutation = useCreateBulkTasks();

  // Create task
  const createTask = useCallback(async (task: TaskCreate) => {
    try {
      await createTaskMutation.mutateAsync({
        ...task,
        user_id: userId,
      });
      showSuccessToast('Task created successfully');
    } catch (error) {
      console.error('Failed to create task:', error instanceof Error ? error.message : 'Unknown error');
      showErrorToast('Failed to create task', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [createTaskMutation, userId, showSuccessToast, showErrorToast]);

  // Update task
  const updateTask = useCallback(async (taskId: number, updates: TaskUpdate) => {
    try {
      await updateTaskMutation.mutateAsync({
        id: taskId,
        data: updates,
      });
      showSuccessToast('Task updated successfully');
    } catch (error) {
      console.error('Failed to update task:', error instanceof Error ? error.message : 'Unknown error');
      showErrorToast('Failed to update task', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [updateTaskMutation, showSuccessToast, showErrorToast]);

  // Complete task
  const completeTask = useCallback(async (taskId: number) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      showSuccessToast('Task completed successfully');
    } catch (error) {
      console.error('Failed to complete task:', error instanceof Error ? error.message : 'Unknown error');
      showErrorToast('Failed to complete task', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [completeTaskMutation, showSuccessToast, showErrorToast]);

  // Delete task
  const deleteTask = useCallback(async (taskId: number) => {
    try {
      await deleteTaskMutation.mutateAsync(taskId);
      showSuccessToast('Task deleted successfully');
    } catch (error) {
      console.error('Failed to delete task:', error instanceof Error ? error.message : 'Unknown error');
      showErrorToast('Failed to delete task', error instanceof Error ? error.message : 'Unknown error');
    }
  }, [deleteTaskMutation, showSuccessToast, showErrorToast]);

  // Create bulk tasks
  const createBulkTasks = useCallback(async (tasks: TaskCreate[]) => {
    try {
      await createBulkTasksMutation.mutateAsync({ tasks });
      showSuccessToast(`${tasks.length} tasks created successfully`, undefined, 4000);
    } catch (error) {
      console.error('Failed to create bulk tasks:', error instanceof Error ? error.message : 'Unknown error');
      showErrorToast('Failed to create tasks', error instanceof Error ? error.message : 'Unknown error', 5000);
    }
  }, [createBulkTasksMutation, showSuccessToast, showErrorToast]);

  return {
    createTask,
    updateTask,
    completeTask,
    deleteTask,
    createBulkTasks,
    isLoading: {
      create: createTaskMutation.isPending,
      update: updateTaskMutation.isPending,
      complete: completeTaskMutation.isPending,
      delete: deleteTaskMutation.isPending,
      bulkCreate: createBulkTasksMutation.isPending,
    },
  };
};
