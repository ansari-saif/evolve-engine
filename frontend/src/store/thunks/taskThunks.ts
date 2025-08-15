import { createAsyncThunk } from '@reduxjs/toolkit';
import { addOptimisticTask, removeOptimisticTask, confirmTask } from '../slices/optimisticUpdatesSlice';
import { addToast } from '../slices/uiSlice';
import type { AppDispatch, RootState } from '../index';
import type { TaskCreate, TaskUpdate, TaskResponse } from '../../client/models';

// Thunk for creating a task with optimistic updates
export const createTaskWithOptimisticUpdate = createAsyncThunk<
  TaskResponse,
  TaskCreate,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'tasks/createWithOptimisticUpdate',
  async (taskData, { dispatch, getState }) => {
    try {
      // Create optimistic task
      const optimisticTask = {
        task_id: Date.now(), // Temporary ID
        description: taskData.description,
        priority: taskData.priority,
        completion_status: 'Pending',
        energy_required: taskData.energy_required,
        estimated_duration: taskData.estimated_duration,
        actual_duration: null,
        scheduled_for_date: taskData.scheduled_for_date,
        started_at: null,
        completed_at: null,
        goal_id: taskData.goal_id,
        ai_generated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isOptimistic: true,
        originalData: taskData,
        createdAt: Date.now(),
      };

      // Add optimistic task to state
      dispatch(addOptimisticTask({ task: optimisticTask }));

      // Show optimistic toast
      dispatch(addToast({
        toast: {
          title: 'Creating task...',
          description: 'Your task is being created',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      const response = await new Promise<TaskResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            ...optimisticTask,
            task_id: Math.floor(Math.random() * 10000) + 1000, // Real ID
            isOptimistic: false,
          });
        }, 1000);
      });

      // Confirm the task (remove optimistic, add to pending)
      dispatch(confirmTask({ taskId: optimisticTask.task_id, confirmedTask: response }));

      // Show success toast
      dispatch(addToast({
        toast: {
          title: 'Task created!',
          description: 'Your task has been successfully created',
          variant: 'default',
          open: true,
        }
      }));

      return response;
    } catch (error) {
      // Remove optimistic task on error
      dispatch(removeOptimisticTask(Date.now()));

      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error creating task',
          description: error instanceof Error ? error.message : 'Failed to create task',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);

// Thunk for updating a task with optimistic updates
export const updateTaskWithOptimisticUpdate = createAsyncThunk<
  TaskResponse,
  { taskId: number; updates: TaskUpdate },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'tasks/updateWithOptimisticUpdate',
  async ({ taskId, updates }, { dispatch, getState }) => {
    try {
      // Get current task state
      const currentTask = getState().optimisticUpdates.optimisticTasks.find(
        task => task.task_id === taskId
      );

      if (!currentTask) {
        throw new Error('Task not found');
      }

      // Create optimistic update
      const optimisticUpdate = {
        ...currentTask,
        ...updates,
        updated_at: new Date().toISOString(),
        isOptimistic: true,
      };

      // Add optimistic task update
      dispatch(addOptimisticTask({ task: optimisticUpdate }));

      // Show optimistic toast
      dispatch(addToast({
        toast: {
          title: 'Updating task...',
          description: 'Your task is being updated',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      const response = await new Promise<TaskResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            ...optimisticUpdate,
            isOptimistic: false,
          });
        }, 1000);
      });

      // Confirm the update
      dispatch(confirmTask({ taskId, confirmedTask: response }));

      // Show success toast
      dispatch(addToast({
        toast: {
          title: 'Task updated!',
          description: 'Your task has been successfully updated',
          variant: 'default',
          open: true,
        }
      }));

      return response;
    } catch (error) {
      // Remove optimistic task on error
      dispatch(removeOptimisticTask(taskId));

      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error updating task',
          description: error instanceof Error ? error.message : 'Failed to update task',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);

// Thunk for bulk task creation
export const createBulkTasksWithOptimisticUpdates = createAsyncThunk<
  TaskResponse[],
  TaskCreate[],
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'tasks/createBulkWithOptimisticUpdates',
  async (tasksData, { dispatch, getState }) => {
    try {
      // Create optimistic tasks
      const optimisticTasks = tasksData.map((taskData, index) => ({
        task_id: Date.now() + index, // Temporary ID
        description: taskData.description,
        priority: taskData.priority,
        completion_status: 'Pending',
        energy_required: taskData.energy_required,
        estimated_duration: taskData.estimated_duration,
        actual_duration: null,
        scheduled_for_date: taskData.scheduled_for_date,
        started_at: null,
        completed_at: null,
        goal_id: taskData.goal_id,
        ai_generated: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isOptimistic: true,
        originalData: taskData,
        createdAt: Date.now(),
      }));

      // Add optimistic tasks to state
      optimisticTasks.forEach(task => {
        dispatch(addOptimisticTask({ task }));
      });

      // Show optimistic toast
      dispatch(addToast({
        toast: {
          title: `Creating ${optimisticTasks.length} tasks...`,
          description: 'Your tasks are being created',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      const responses = await Promise.all(
        optimisticTasks.map(async (optimisticTask, index) => {
          return new Promise<TaskResponse>((resolve) => {
            setTimeout(() => {
              resolve({
                ...optimisticTask,
                task_id: Math.floor(Math.random() * 10000) + 1000 + index, // Real ID
                isOptimistic: false,
              });
            }, 1000 + index * 200); // Stagger the responses
          });
        })
      );

      // Confirm all tasks
      responses.forEach((response, index) => {
        dispatch(confirmTask({ 
          taskId: optimisticTasks[index].task_id, 
          confirmedTask: response 
        }));
      });

      // Show success toast
      dispatch(addToast({
        toast: {
          title: `${responses.length} tasks created!`,
          description: 'All tasks have been successfully created',
          variant: 'default',
          open: true,
        }
      }));

      return responses;
    } catch (error) {
      // Remove all optimistic tasks on error
      const optimisticTasks = getState().optimisticUpdates.optimisticTasks;
      optimisticTasks.forEach(task => {
        if (task.isOptimistic) {
          dispatch(removeOptimisticTask(task.task_id));
        }
      });

      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error creating tasks',
          description: error instanceof Error ? error.message : 'Failed to create tasks',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);
