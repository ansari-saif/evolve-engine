import { useSelector, useDispatch } from 'react-redux';
import {
  selectIsGenerating,
  selectIsCreating,
  selectIsSuccess,
  selectGenerationError,
  selectCreationError,
  setGenerating,
  setCreating,
  setSuccess,
  setGenerationError,
  setCreationError,
} from '../../store/slices/dialogSlice';
import type { AppDispatch } from '../../store';

export const useDialogStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const isGenerating = useSelector(selectIsGenerating);
  const isCreating = useSelector(selectIsCreating);
  const isSuccess = useSelector(selectIsSuccess);
  const generationError = useSelector(selectGenerationError);
  const creationError = useSelector(selectCreationError);
  
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
  
  return {
    isGenerating,
    isCreating,
    isSuccess,
    generationError,
    creationError,
    updateGenerating,
    updateCreating,
    updateSuccess,
    updateGenerationError,
    updateCreationError,
  };
};
