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
    const toastId = crypto.randomUUID();
    dispatch(addToast({ 
      toast: {
        ...toast,
        id: toastId,
      } as ToastState
    }));
    return toastId;
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
  const showSuccessToast = (title: string, description?: string, duration: number = 1000) => {
    showToast({
      title,
      description,
      variant: 'default',
      open: true,
      duration,
    });
  };
  
  const showErrorToast = (title: string, description?: string, duration: number = 3000) => {
    showToast({
      title,
      description,
      variant: 'destructive',
      open: true,
      duration,
    });
  };
  
  const showInfoToast = (title: string, description?: string, duration: number = 2000) => {
    showToast({
      title,
      description,
      variant: 'default',
      open: true,
      duration,
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
