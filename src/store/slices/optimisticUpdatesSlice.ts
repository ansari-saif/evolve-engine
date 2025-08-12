import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  OptimisticUpdatesState, 
  OptimisticTask, 
  PendingOperation,
  AddOptimisticTaskPayload,
  ConfirmTaskPayload
} from '../types';

// Initial state
const initialState: OptimisticUpdatesState = {
  optimisticTasks: [],
  pendingOperations: {},
};

// Create the slice
const optimisticUpdatesSlice = createSlice({
  name: 'optimisticUpdates',
  initialState,
  reducers: {
    // Add optimistic task
    addOptimisticTask: (state, action: PayloadAction<AddOptimisticTaskPayload>) => {
      state.optimisticTasks.push(action.payload.task);
    },
    
    // Confirm task (remove from optimistic and add to pending operations)
    confirmTask: (state, action: PayloadAction<ConfirmTaskPayload>) => {
      const { taskId, confirmedTask } = action.payload;
      state.optimisticTasks = state.optimisticTasks.filter(task => task.task_id !== taskId);
      
      // Add to pending operations
      const operationId = `task_${taskId}_${Date.now()}`;
      state.pendingOperations[operationId] = {
        id: operationId,
        type: 'create',
        entityType: 'task',
        entityId: confirmedTask.task_id,
        timestamp: Date.now(),
        data: confirmedTask,
      };
    },
    
    // Remove optimistic task
    removeOptimisticTask: (state, action: PayloadAction<number>) => {
      const taskId = action.payload;
      state.optimisticTasks = state.optimisticTasks.filter(task => task.task_id !== taskId);
    },
    
    // Clear all optimistic tasks
    clearOptimisticTasks: (state) => {
      state.optimisticTasks = [];
    },
    
    // Add pending operation
    addPendingOperation: (state, action: PayloadAction<PendingOperation>) => {
      state.pendingOperations[action.payload.id] = action.payload;
    },
    
    // Remove pending operation
    removePendingOperation: (state, action: PayloadAction<string>) => {
      const operationId = action.payload;
      delete state.pendingOperations[operationId];
    },
    
    // Clear all pending operations
    clearPendingOperations: (state) => {
      state.pendingOperations = {};
    },
    
    // Update optimistic task
    updateOptimisticTask: (state, action: PayloadAction<{ taskId: number; updates: Partial<OptimisticTask> }>) => {
      const { taskId, updates } = action.payload;
      const taskIndex = state.optimisticTasks.findIndex(task => task.task_id === taskId);
      if (taskIndex !== -1) {
        state.optimisticTasks[taskIndex] = { ...state.optimisticTasks[taskIndex], ...updates };
      }
    },
    
    // Reset optimistic updates state
    resetOptimisticUpdates: (state) => {
      return initialState;
    },
  },
});

// Export actions
export const {
  addOptimisticTask,
  confirmTask,
  removeOptimisticTask,
  clearOptimisticTasks,
  addPendingOperation,
  removePendingOperation,
  clearPendingOperations,
  updateOptimisticTask,
  resetOptimisticUpdates,
} = optimisticUpdatesSlice.actions;

// Export reducer
export default optimisticUpdatesSlice.reducer;

// Export selectors
export const selectOptimisticTasks = (state: { optimisticUpdates: OptimisticUpdatesState }) => 
  state.optimisticUpdates.optimisticTasks;

export const selectPendingOperations = (state: { optimisticUpdates: OptimisticUpdatesState }) => 
  state.optimisticUpdates.pendingOperations;

export const selectHasOptimisticTasks = (state: { optimisticUpdates: OptimisticUpdatesState }) => 
  state.optimisticUpdates.optimisticTasks.length > 0;

export const selectOptimisticTask = (taskId: number) => (state: { optimisticUpdates: OptimisticUpdatesState }) => 
  state.optimisticUpdates.optimisticTasks.find(task => task.task_id === taskId);

export const selectPendingOperation = (operationId: string) => (state: { optimisticUpdates: OptimisticUpdatesState }) => 
  state.optimisticUpdates.pendingOperations[operationId];
