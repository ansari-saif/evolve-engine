import { useSelector, useDispatch } from 'react-redux';
import {
  selectToasts,
  addToast,
  updateToast,
  dismissToast,
  removeToast,
  clearAllToasts,
} from '../../store/slices/uiSlice';
import type { AppDispatch } from '../../store';
import type { ToastState } from '../../store/types';

// Custom hook for toast management
export const useToasts = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Selectors
  const toasts = useSelector(selectToasts);
  
  // Actions
  const showToast = (toast: Omit<ToastState, 'id'>) => {
    dispatch(addToast({ toast }));
  };
  
  const updateToastById = (id: string, updates: Partial<ToastState>) => {
    dispatch(updateToast({ id, updates }));
  };
  
  const hideToast = (id: string) => {
    dispatch(dismissToast(id));
  };
  
  const removeToastById = (id: string) => {
    dispatch(removeToast(id));
  };
  
  const clearToasts = () => {
    dispatch(clearAllToasts());
  };
  
  // Convenience methods for common toast types
  const showSuccessToast = (title: string, description?: string) => {
    showToast({
      title,
      description,
      variant: 'default',
      open: true,
    });
  };
  
  const showErrorToast = (title: string, description?: string) => {
    showToast({
      title,
      description,
      variant: 'destructive',
      open: true,
    });
  };
  
  const showInfoToast = (title: string, description?: string) => {
    showToast({
      title,
      description,
      variant: 'default',
      open: true,
    });
  };
  
  return {
    // State
    toasts,
    
    // Actions
    showToast,
    updateToast: updateToastById,
    dismissToast: hideToast,
    removeToast: removeToastById,
    clearToasts,
    
    // Convenience methods
    showSuccessToast,
    showErrorToast,
    showInfoToast,
  };
};
