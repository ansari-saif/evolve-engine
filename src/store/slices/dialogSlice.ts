import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { 
  DialogState, 
  DialogStateEnum, 
  GeneratedTask, 
  EditableGeneratedTask,
  SetEnergyLevelPayload,
  SetCurrentPhasePayload,
  SetGeneratedTasksPayload,
  SetEditedTasksPayload,
  SetFormErrorsPayload
} from '../types';

// Initial state based on current DialogStateManager
const initialState: DialogState = {
  currentState: 'INITIAL' as DialogStateEnum,
  energyLevel: 5,
  currentPhase: null,
  generatedTasks: [],
  editedTasks: [],
  isGenerating: false,
  isCreating: false,
  isSuccess: false,
  generationError: null,
  creationError: null,
  formErrors: {},
};

// Create the slice
const dialogSlice = createSlice({
  name: 'dialog',
  initialState,
  reducers: {
    // Set dialog state
    setDialogState: (state, action: PayloadAction<DialogStateEnum>) => {
      state.currentState = action.payload;
    },
    
    // Set energy level
    setEnergyLevel: (state, action: PayloadAction<SetEnergyLevelPayload>) => {
      state.energyLevel = action.payload.energyLevel;
    },
    
    // Set current phase
    setCurrentPhase: (state, action: PayloadAction<SetCurrentPhasePayload>) => {
      state.currentPhase = action.payload.phase;
    },
    
    // Set generated tasks
    setGeneratedTasks: (state, action: PayloadAction<SetGeneratedTasksPayload>) => {
      state.generatedTasks = action.payload.tasks;
    },
    
    // Set edited tasks
    setEditedTasks: (state, action: PayloadAction<SetEditedTasksPayload>) => {
      state.editedTasks = action.payload.tasks;
    },
    
    // Set generating state
    setGenerating: (state, action: PayloadAction<boolean>) => {
      state.isGenerating = action.payload;
    },
    
    // Set creating state
    setCreating: (state, action: PayloadAction<boolean>) => {
      state.isCreating = action.payload;
    },
    
    // Set success state
    setSuccess: (state, action: PayloadAction<boolean>) => {
      state.isSuccess = action.payload;
    },
    
    // Set generation error
    setGenerationError: (state, action: PayloadAction<string | null>) => {
      state.generationError = action.payload;
    },
    
    // Set creation error
    setCreationError: (state, action: PayloadAction<string | null>) => {
      state.creationError = action.payload;
    },
    
    // Set form errors
    setFormErrors: (state, action: PayloadAction<SetFormErrorsPayload>) => {
      state.formErrors = action.payload.errors;
    },
    
    // Reset state
    resetDialogState: (state) => {
      return initialState;
    },
    
    // Go back to initial state
    goBack: (state) => {
      state.currentState = DialogStateEnum.INITIAL;
      state.isSuccess = false;
      state.generatedTasks = [];
      state.editedTasks = [];
      state.generationError = null;
      state.creationError = null;
      state.formErrors = {};
    },
    
    // Go to preview state
    goToPreview: (state) => {
      state.currentState = DialogStateEnum.PREVIEW;
      state.isGenerating = false;
      state.generationError = null;
      state.formErrors = {};
    },
    
    // Go to success state
    goToSuccess: (state) => {
      state.currentState = DialogStateEnum.SUCCESS;
      state.isCreating = false;
      state.creationError = null;
      state.isSuccess = true;
    },
    
    // Update a specific edited task
    updateEditedTask: (state, action: PayloadAction<{ id: string; updates: Partial<EditableGeneratedTask> }>) => {
      const { id, updates } = action.payload;
      const taskIndex = state.editedTasks.findIndex(task => task.id === id);
      if (taskIndex !== -1) {
        state.editedTasks[taskIndex] = { ...state.editedTasks[taskIndex], ...updates };
      }
    },
    
    // Remove a specific edited task
    removeEditedTask: (state, action: PayloadAction<string>) => {
      const taskId = action.payload;
      state.editedTasks = state.editedTasks.filter(task => task.id !== taskId);
    },
  },
});

// Export actions
export const {
  setDialogState,
  setEnergyLevel,
  setCurrentPhase,
  setGeneratedTasks,
  setEditedTasks,
  setGenerating,
  setCreating,
  setSuccess,
  setGenerationError,
  setCreationError,
  setFormErrors,
  resetDialogState,
  goBack,
  goToPreview,
  goToSuccess,
  updateEditedTask,
  removeEditedTask,
} = dialogSlice.actions;

// Export reducer
export default dialogSlice.reducer;

// Export selectors
export const selectDialogState = (state: { dialog: DialogState }) => state.dialog.currentState;
export const selectEnergyLevel = (state: { dialog: DialogState }) => state.dialog.energyLevel;
export const selectCurrentPhase = (state: { dialog: DialogState }) => state.dialog.currentPhase;
export const selectGeneratedTasks = (state: { dialog: DialogState }) => state.dialog.generatedTasks;
export const selectEditedTasks = (state: { dialog: DialogState }) => state.dialog.editedTasks;
export const selectIsGenerating = (state: { dialog: DialogState }) => state.dialog.isGenerating;
export const selectIsCreating = (state: { dialog: DialogState }) => state.dialog.isCreating;
export const selectIsSuccess = (state: { dialog: DialogState }) => state.dialog.isSuccess;
export const selectGenerationError = (state: { dialog: DialogState }) => state.dialog.generationError;
export const selectCreationError = (state: { dialog: DialogState }) => state.dialog.creationError;
export const selectFormErrors = (state: { dialog: DialogState }) => state.dialog.formErrors;
