import { useDispatch } from 'react-redux';
import {
  resetDialogState,
  goBack,
  goToPreview,
  goToSuccess,
  setFormErrors,
} from '../../store/slices/dialogSlice';
import type { AppDispatch } from '../../store';

export const useDialogNavigation = () => {
  const dispatch = useDispatch<AppDispatch>();
  
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
  
  const updateFormErrors = (errors: { energy?: string; phase?: string }) => {
    dispatch(setFormErrors({ errors }));
  };
  
  return {
    resetDialog,
    handleGoBack,
    handleGoToPreview,
    handleGoToSuccess,
    updateFormErrors,
  };
};
