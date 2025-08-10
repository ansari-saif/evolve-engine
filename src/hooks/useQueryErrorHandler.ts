import { useEffect } from 'react';
import { useErrorHandler } from './useErrorHandler';
import { getErrorMessage } from '../utils/errorHandling';

export interface QueryErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  onError?: (error: unknown) => void;
}

export const useQueryErrorHandler = (
  error: unknown,
  options: QueryErrorHandlerOptions = {}
) => {
  const { handleError } = useErrorHandler();
  const { showToast = true, toastTitle = 'Error', onError } = options;

  useEffect(() => {
    if (error) {
      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }

      // Show toast notification
      if (showToast) {
        handleError(error, {
          showToast: true,
          toastTitle,
        });
      }
    }
  }, [error, showToast, toastTitle, onError, handleError]);

  return {
    errorMessage: error ? getErrorMessage(error) : null,
    hasError: !!error,
  };
};
