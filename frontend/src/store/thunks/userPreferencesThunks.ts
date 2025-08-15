import { createAsyncThunk } from '@reduxjs/toolkit';
import { updateConfig, setUserId } from '../slices/appConfigSlice';
import { addToast } from '../slices/uiSlice';
import type { AppDispatch, RootState } from '../index';

// Thunk for updating user preferences
export const updateUserPreferences = createAsyncThunk<
  void,
  { preferences: Record<string, unknown> },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'userPreferences/update',
  async ({ preferences }, { dispatch, getState }) => {
    try {
      // Validate preferences
      if (!preferences || Object.keys(preferences).length === 0) {
        throw new Error('No preferences to update');
      }

      // Show loading toast
      dispatch(addToast({
        toast: {
          title: 'Updating preferences...',
          description: 'Your preferences are being saved',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      // Update local state
      dispatch(updateConfig(preferences));

      // Show success toast
      dispatch(addToast({
        toast: {
          title: 'Preferences updated!',
          description: 'Your preferences have been successfully saved',
          variant: 'default',
          open: true,
        }
      }));
    } catch (error) {
      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error updating preferences',
          description: error instanceof Error ? error.message : 'Failed to update preferences',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);

// Thunk for updating user ID
export const updateUserIdWithValidation = createAsyncThunk<
  void,
  { userId: string },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'userPreferences/updateUserId',
  async ({ userId }, { dispatch }) => {
    try {
      // Validate user ID
      if (!userId?.trim()) {
        throw new Error('User ID is required');
      }

      // Show loading toast
      dispatch(addToast({
        toast: {
          title: 'Updating user ID...',
          description: 'Your user ID is being updated',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1000);
      });

      // Update local state
      dispatch(setUserId(userId));

      // Show success toast
      dispatch(addToast({
        toast: {
          title: 'User ID updated!',
          description: 'Your user ID has been successfully updated',
          variant: 'default',
          open: true,
        }
      }));
    } catch (error) {
      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error updating user ID',
          description: error instanceof Error ? error.message : 'Failed to update user ID',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);

// Thunk for bulk user preference updates
export const updateBulkUserPreferences = createAsyncThunk<
  void,
  { 
    userId?: string; 
    preferences?: Record<string, unknown>;
    theme?: string;
    language?: string;
  },
  {
    dispatch: AppDispatch;
    state: RootState;
  }
>(
  'userPreferences/bulkUpdate',
  async ({ userId, preferences, theme, language }, { dispatch }) => {
    try {
      // Validate at least one update
      if (!userId && !preferences && !theme && !language) {
        throw new Error('No updates to perform');
      }

      // Show loading toast
      dispatch(addToast({
        toast: {
          title: 'Updating settings...',
          description: 'Your settings are being updated',
          variant: 'default',
          open: true,
        }
      }));

      // Simulate API call (replace with actual API call)
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, 1500);
      });

      // Update local state
      if (userId) {
        dispatch(setUserId(userId));
      }

      if (preferences) {
        dispatch(updateConfig(preferences));
      }

      // Handle theme and language updates here when needed
      if (theme) {
        // Dispatch theme update action
        console.log('Theme update:', theme);
      }

      if (language) {
        // Dispatch language update action
        console.log('Language update:', language);
      }

      // Show success toast
      dispatch(addToast({
        toast: {
          title: 'Settings updated!',
          description: 'Your settings have been successfully updated',
          variant: 'default',
          open: true,
        }
      }));
    } catch (error) {
      // Show error toast
      dispatch(addToast({
        toast: {
          title: 'Error updating settings',
          description: error instanceof Error ? error.message : 'Failed to update settings',
          variant: 'destructive',
          open: true,
        }
      }));

      throw error;
    }
  }
);
