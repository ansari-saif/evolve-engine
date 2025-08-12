import { useSelector, useDispatch } from 'react-redux';
import {
  selectDialogState,
  selectEnergyLevel,
  selectCurrentPhase,
  selectGeneratedTasks,
  selectEditedTasks,
  selectIsGenerating,
  selectIsCreating,
  selectIsSuccess,
  selectGenerationError,
  selectCreationError,
  selectFormErrors,
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
} from '../../store/slices/dialogSlice';
import type { AppDispatch } from '../../store';
import type { DialogStateEnum, GeneratedTask, EditableGeneratedTask } from '../../store/types';

// Custom hook for dialog management
export const useDialogs = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const currentState = useSelector(selectDialogState);
  const energyLevel = useSelector(selectEnergyLevel);
  const currentPhase = useSelector(selectCurrentPhase);
  const generatedTasks = useSelector(selectGeneratedTasks);
  const editedTasks = useSelector(selectEditedTasks);
  const isGenerating = useSelector(selectIsGenerating);
  const isCreating = useSelector(selectIsCreating);
  const isSuccess = useSelector(selectIsSuccess);
  const generationError = useSelector(selectGenerationError);
  const creationError = useSelector(selectCreationError);
  const formErrors = useSelector(selectFormErrors);
  
  // Actions
  const updateDialogState = (state: DialogStateEnum) => {
    dispatch(setDialogState(state));
  };
  
  const updateEnergyLevel = (level: number) => {
    dispatch(setEnergyLevel({ energyLevel: level }));
  };
  
  const updateCurrentPhase = (phase: string | null) => {
    dispatch(setCurrentPhase({ phase }));
  };
  
  const updateGeneratedTasks = (tasks: GeneratedTask[]) => {
    dispatch(setGeneratedTasks({ tasks }));
  };
  
  const updateEditedTasks = (tasks: EditableGeneratedTask[]) => {
    dispatch(setEditedTasks({ tasks }));
  };
  
  const updateGenerating = (generating: boolean) => {
    dispatch(setGenerating(generating));
  };
  
  const updateCreating = (creating: boolean) => {
    dispatch(setCreating(creating));
  };
  
  const updateSuccess = (success: boolean) => {
    dispatch(setSuccess(success));
  };
  
  const updateGenerationError = (error: string | null) => {
    dispatch(setGenerationError(error));
  };
  
  const updateCreationError = (error: string | null) => {
    dispatch(setCreationError(error));
  };
  
  const updateFormErrors = (errors: { energy?: string; phase?: string }) => {
    dispatch(setFormErrors({ errors }));
  };
  
  const resetDialog = () => {
    dispatch(resetDialogState());
  };
  
  const handleGoBack = () => {
    dispatch(goBack());
  };
  
  const handleGoToPreview = () => {
    dispatch(goToPreview());
  };
  
  const handleGoToSuccess = () => {
    dispatch(goToSuccess());
  };
  
  const handleUpdateEditedTask = (id: string, updates: Partial<EditableGeneratedTask>) => {
    dispatch(updateEditedTask({ id, updates }));
  };
  
  const handleRemoveEditedTask = (taskId: string) => {
    dispatch(removeEditedTask(taskId));
  };
  
  return {
    // State
    currentState,
    energyLevel,
    currentPhase,
    generatedTasks,
    editedTasks,
    isGenerating,
    isCreating,
    isSuccess,
    generationError,
    creationError,
    formErrors,
    
    // Actions
    updateDialogState,
    updateEnergyLevel,
    updateCurrentPhase,
    updateGeneratedTasks,
    updateEditedTasks,
    updateGenerating,
    updateCreating,
    updateSuccess,
    updateGenerationError,
    updateCreationError,
    updateFormErrors,
    resetDialog,
    handleGoBack,
    handleGoToPreview,
    handleGoToSuccess,
    handleUpdateEditedTask,
    handleRemoveEditedTask,
  };
};
