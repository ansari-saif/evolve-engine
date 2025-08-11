import { useState, useCallback, useRef } from 'react';
import type { TaskCreate } from '../client/models';

export type ErrorType = 
  | 'network'
  | 'validation'
  | 'server'
  | 'timeout'
  | 'unknown';

export interface BulkError {
  id: string;
  type: ErrorType;
  message: string;
  taskData?: TaskCreate;
  taskId?: number;
  retryCount: number;
  timestamp: number;
  canRetry: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

export interface BulkErrorHandlingState {
  errors: BulkError[];
  addError: (error: Omit<BulkError, 'id' | 'retryCount' | 'timestamp'>) => void;
  removeError: (errorId: string) => void;
  retryError: (errorId: string, retryFunction: () => Promise<void>) => Promise<void>;
  retryAllErrors: (retryFunction: (taskData: TaskCreate) => Promise<void>) => Promise<void>;
  clearErrors: () => void;
  getErrorsByType: (type: ErrorType) => BulkError[];
  hasErrors: boolean;
  hasRetryableErrors: boolean;
}

const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2
};

export function useBulkErrorHandling(config: Partial<RetryConfig> = {}): BulkErrorHandlingState {
  const [errors, setErrors] = useState<BulkError[]>([]);
  const retryTimeouts = useRef<Map<string, NodeJS.Timeout>>(new Map());
  const retryConfig = { ...DEFAULT_RETRY_CONFIG, ...config };

  const classifyError = (error: Error & { status?: number; name?: string }): ErrorType => {
    if (error.name === 'NetworkError' || error.message?.includes('network')) {
      return 'network';
    }
    if (error.status === 400 || error.message?.includes('validation')) {
      return 'validation';
    }
    if (error.status >= 500 || error.message?.includes('server')) {
      return 'server';
    }
    if (error.name === 'TimeoutError' || error.message?.includes('timeout')) {
      return 'timeout';
    }
    return 'unknown';
  };

  const canRetryError = (errorType: ErrorType, retryCount: number): boolean => {
    if (retryCount >= retryConfig.maxRetries) {
      return false;
    }

    // Don't retry validation errors
    if (errorType === 'validation') {
      return false;
    }

    // Retry network, server, and timeout errors
    return ['network', 'server', 'timeout'].includes(errorType);
  };

  const calculateRetryDelay = (retryCount: number): number => {
    const delay = retryConfig.baseDelay * Math.pow(retryConfig.backoffMultiplier, retryCount);
    return Math.min(delay, retryConfig.maxDelay);
  };

  const addError = useCallback((error: Omit<BulkError, 'id' | 'retryCount' | 'timestamp'>) => {
    const newError: BulkError = {
      ...error,
      id: `error-${Date.now()}-${Math.random()}`,
      retryCount: 0,
      timestamp: Date.now(),
      canRetry: canRetryError(error.type, 0)
    };

    setErrors(prev => [...prev, newError]);
  }, [canRetryError]);

  const removeError = useCallback((errorId: string) => {
    // Clear any pending retry timeout
    const timeout = retryTimeouts.current.get(errorId);
    if (timeout) {
      clearTimeout(timeout);
      retryTimeouts.current.delete(errorId);
    }

    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const retryError = useCallback(async (errorId: string, retryFunction: () => Promise<void>) => {
    const error = errors.find(e => e.id === errorId);
    if (!error || !error.canRetry) {
      return;
    }

    const newRetryCount = error.retryCount + 1;
    const canRetry = canRetryError(error.type, newRetryCount);

    // Update error with new retry count
    setErrors(prev => prev.map(e => 
      e.id === errorId 
        ? { ...e, retryCount: newRetryCount, canRetry }
        : e
    ));

    try {
      await retryFunction();
      
      // If successful, remove the error
      removeError(errorId);
    } catch (retryError) {
      // If retry failed, update the error
      const retryErrorType = classifyError(retryError);
      const canRetryAgain = canRetryError(retryErrorType, newRetryCount);

      setErrors(prev => prev.map(e => 
        e.id === errorId 
          ? { 
              ...e, 
              type: retryErrorType,
              message: retryError.message || 'Retry failed',
              retryCount: newRetryCount,
              canRetry: canRetryAgain
            }
          : e
      ));

      // If we can retry again, schedule the next retry
      if (canRetryAgain) {
        const delay = calculateRetryDelay(newRetryCount);
        const timeout = setTimeout(() => {
          retryError(errorId, retryFunction);
        }, delay);
        retryTimeouts.current.set(errorId, timeout);
      }
    }
  }, [errors, removeError, calculateRetryDelay, canRetryError]);

  const retryAllErrors = useCallback(async (retryFunction: (taskData: TaskCreate) => Promise<void>) => {
    const retryableErrors = errors.filter(error => error.canRetry && error.taskData);
    
    const retryPromises = retryableErrors.map(error => 
      retryFunction(error.taskData!)
    );

    try {
      await Promise.allSettled(retryPromises);
      
      // Remove all retryable errors that were attempted
      setErrors(prev => prev.filter(error => !error.canRetry || !error.taskData));
    } catch (error) {
      console.error('Bulk retry failed:', error);
    }
  }, [errors]);

  const clearErrors = useCallback(() => {
    // Clear all pending retry timeouts
    retryTimeouts.current.forEach(timeout => clearTimeout(timeout));
    retryTimeouts.current.clear();
    
    setErrors([]);
  }, []);

  const getErrorsByType = useCallback((type: ErrorType) => {
    return errors.filter(error => error.type === type);
  }, [errors]);

  const hasErrors = errors.length > 0;
  const hasRetryableErrors = errors.some(error => error.canRetry);

  return {
    errors,
    addError,
    removeError,
    retryError,
    retryAllErrors,
    clearErrors,
    getErrorsByType,
    hasErrors,
    hasRetryableErrors
  };
}
