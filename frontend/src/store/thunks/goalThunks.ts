import { createAsyncThunk } from '@reduxjs/toolkit';
import { addToast } from '../slices/uiSlice';
import type { AppDispatch, RootState } from '../index';
import type { GoalCreate, GoalUpdate, GoalResponse } from '../../client/models';

// Thunk for creating a goal with validation
export const createGoalWithValidation = createAsyncThunk<
  GoalResponse,
  GoalCreate,
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'goals/createWithValidation',
  async (goalData, { dispatch }) => {
    try {
      // Validate goal data
      if (!goalData.description?.trim()) {
        throw new Error('Goal description is required');
      }

      if (!goalData.type) {
        throw new Error('Goal type is required');
      }

      if (!goalData.priority) {
        throw new Error('Goal priority is required');
      }

      // Show loading toast
      dispatch(addToast({
        toast: {
          title: 'Creating goal...',
          description: 'Your goal is being created',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      const response = await new Promise<GoalResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            goal_id: Math.floor(Math.random() * 10000) + 1000,
            description: goalData.description,
            type: goalData.type,
            priority: goalData.priority,
            phase: goalData.phase,
            user_id: goalData.user_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }, 1000);
      });

      // Show success toast
      dispatch(addToast({
        toast: {
          title: 'Goal created!',
          description: 'Your goal has been successfully created',
          variant: 'default',
          open: true,
        }
      }));

      return response;
    } catch (error) {
      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error creating goal',
          description: error instanceof Error ? error.message : 'Failed to create goal',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);

// Thunk for updating a goal with validation
export const updateGoalWithValidation = createAsyncThunk<
  GoalResponse,
  { goalId: number; updates: GoalUpdate },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'goals/updateWithValidation',
  async ({ goalId, updates }, { dispatch }) => {
    try {
      // Validate updates
      if (updates.description && !updates.description.trim()) {
        throw new Error('Goal description cannot be empty');
      }

      // Show loading toast
      dispatch(addToast({
        toast: {
          title: 'Updating goal...',
          description: 'Your goal is being updated',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      const response = await new Promise<GoalResponse>((resolve) => {
        setTimeout(() => {
          resolve({
            goal_id: goalId,
            description: updates.description || 'Updated Goal',
            type: updates.type || 'Monthly',
            priority: updates.priority || 'Medium',
            phase: updates.phase || 'Research',
            user_id: 1, // Mock user ID
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        }, 1000);
      });

      // Show success toast
      dispatch(addToast({
        toast: {
          title: 'Goal updated!',
          description: 'Your goal has been successfully updated',
          variant: 'default',
          open: true,
        }
      }));

      return response;
    } catch (error) {
      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error updating goal',
          description: error instanceof Error ? error.message : 'Failed to update goal',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);

// Thunk for bulk goal operations
export const performBulkGoalOperations = createAsyncThunk<
  GoalResponse[],
  { operations: Array<{ type: 'create' | 'update' | 'delete'; data: GoalCreate | GoalUpdate; goalId?: number }> },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'goals/bulkOperations',
  async ({ operations }, { dispatch }) => {
    try {
      // Validate operations
      if (operations.length === 0) {
        throw new Error('No operations to perform');
      }

      // Show loading toast
      dispatch(addToast({
        toast: {
          title: `Processing ${operations.length} goal operations...`,
          description: 'Please wait while we process your goals',
          variant: 'default',
          open: true,
        }
      }));

      // Process operations sequentially
      const results: GoalResponse[] = [];
      
      for (const operation of operations) {
        try {
          if (operation.type === 'create') {
            const result = await dispatch(createGoalWithValidation(operation.data as GoalCreate)).unwrap();
            results.push(result);
          } else if (operation.type === 'update' && operation.goalId) {
            const result = await dispatch(updateGoalWithValidation({
              goalId: operation.goalId,
              updates: operation.data as GoalUpdate
            })).unwrap();
            results.push(result);
          }
          // Add delete operation handling here when needed
        } catch (error) {
          console.error(`Failed to process operation:`, operation, error);
          // Continue with other operations
        }
      }

      // Show success toast
      dispatch(addToast({
        toast: {
          title: `${results.length} operations completed!`,
          description: `${results.length} out of ${operations.length} operations were successful`,
          variant: 'default',
          open: true,
        }
      }));

      return results;
    } catch (error) {
      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error processing operations',
          description: error instanceof Error ? error.message : 'Failed to process goal operations',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);
