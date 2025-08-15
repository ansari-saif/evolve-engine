import { useCallback } from 'react';
import { useToast } from './use-toast';
import { getErrorMessage, isNetworkError, isServerError, isClientError } from '../utils/errorHandling';

export interface ErrorHandlerOptions {
  showToast?: boolean;
  toastTitle?: string;
  retryCount?: number;
  retryDelay?: number;
}

export const useErrorHandler = () => {
  const { toast } = useToast();

  const handleError = useCallback((
    error: unknown, 
    options: ErrorHandlerOptions = {}
  ) => {
    const {
      showToast = true,
      toastTitle = 'Error',
      retryCount = 2,
      retryDelay = 1000
    } = options;

    const errorMessage = getErrorMessage(error);
    
    // Log error for debugging (safely)
    try {
      console.error(`${toastTitle}:`, errorMessage);
      if (error instanceof Error) {
        console.error('Error details:', error.message, error.stack);
      }
    } catch (logError) {
      console.error(`${toastTitle}:`, errorMessage, '(Error logging failed)');
    }

    // Show toast notification if enabled
    if (showToast) {
      toast({
        title: toastTitle,
        description: errorMessage,
        variant: isServerError(error) ? 'destructive' : 'default',
      });
    }

    return {
      message: errorMessage,
      isNetworkError: isNetworkError(error),
      isServerError: isServerError(error),
      isClientError: isClientError(error),
      retryCount,
      retryDelay
    };
  }, [toast]);

  const createRetryConfig = (retryCount: number = 2, retryDelay: number = 1000) => ({
    retry: retryCount,
    retryDelay: retryDelay,
  });

  return {
    handleError,
    createRetryConfig,
  };
};
