import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, RefreshCw, X, Wifi, Server, Clock, AlertTriangle } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import type { BulkError, ErrorType } from '../../hooks/use-bulk-error-handling';

export interface BulkErrorDisplayProps {
  /** Array of errors to display */
  errors: BulkError[];
  /** Function to retry a specific error */
  onRetry: (errorId: string) => void;
  /** Function to retry all errors */
  onRetryAll: () => void;
  /** Function to dismiss an error */
  onDismiss: (errorId: string) => void;
  /** Function to clear all errors */
  onClearAll: () => void;
  /** Custom CSS class */
  className?: string;
  /** Whether to show the retry all button */
  showRetryAll?: boolean;
}

const getErrorIcon = (type: ErrorType) => {
  switch (type) {
    case 'network':
      return <Wifi className="w-4 h-4" />;
    case 'server':
      return <Server className="w-4 h-4" />;
    case 'timeout':
      return <Clock className="w-4 h-4" />;
    case 'validation':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <AlertCircle className="w-4 h-4" />;
  }
};

const getErrorColor = (type: ErrorType) => {
  switch (type) {
    case 'network':
      return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'server':
      return 'bg-red-50 border-red-200 text-red-800';
    case 'timeout':
      return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    case 'validation':
      return 'bg-orange-50 border-orange-200 text-orange-800';
    default:
      return 'bg-gray-50 border-gray-200 text-gray-800';
  }
};

const getErrorTypeLabel = (type: ErrorType) => {
  switch (type) {
    case 'network':
      return 'Network Error';
    case 'server':
      return 'Server Error';
    case 'timeout':
      return 'Timeout';
    case 'validation':
      return 'Validation Error';
    default:
      return 'Unknown Error';
  }
};

export const BulkErrorDisplay: React.FC<BulkErrorDisplayProps> = ({
  errors,
  onRetry,
  onRetryAll,
  onDismiss,
  onClearAll,
  className = '',
  showRetryAll = true
}) => {
  if (errors.length === 0) {
    return null;
  }

  const retryableErrors = errors.filter(error => error.canRetry);
  const nonRetryableErrors = errors.filter(error => !error.canRetry);

  return (
    <div className={cn('space-y-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {errors.length} Error{errors.length !== 1 ? 's' : ''} Occurred
          </h3>
        </div>
        
        <div className="flex items-center gap-2">
          {showRetryAll && retryableErrors.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetryAll}
              className="text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-1" />
              Retry All ({retryableErrors.length})
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            <X className="w-3 h-3 mr-1" />
            Clear All
          </Button>
        </div>
      </div>

      {/* Error List */}
      <div className="space-y-3">
        {errors.map((error) => (
          <div
            key={error.id}
            className={cn(
              'p-4 border rounded-lg transition-all duration-200',
              getErrorColor(error.type)
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  {getErrorIcon(error.type)}
                  <span className="font-medium">{getErrorTypeLabel(error.type)}</span>
                  <Badge variant="outline" className="text-xs">
                    {error.retryCount > 0 ? `Retry ${error.retryCount}` : 'First attempt'}
                  </Badge>
                  {!error.canRetry && (
                    <Badge variant="secondary" className="text-xs">
                      Non-retryable
                    </Badge>
                  )}
                </div>
                
                <p className="text-sm mb-2">{error.message}</p>
                
                {error.taskData && (
                  <div className="text-xs text-gray-600 bg-white/50 p-2 rounded">
                    <strong>Task:</strong> {error.taskData.description}
                  </div>
                )}
                
                <div className="text-xs text-gray-500 mt-2">
                  {new Date(error.timestamp).toLocaleTimeString()}
                </div>
              </div>

              <div className="flex items-center gap-1">
                {error.canRetry && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onRetry(error.id)}
                    className="text-xs"
                    disabled={error.retryCount >= 3}
                  >
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Retry
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDismiss(error.id)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      {errors.length > 1 && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center justify-between">
            <span>
              {retryableErrors.length > 0 && (
                <span className="text-blue-600">
                  {retryableErrors.length} can be retried
                </span>
              )}
              {retryableErrors.length > 0 && nonRetryableErrors.length > 0 && ' • '}
              {nonRetryableErrors.length > 0 && (
                <span className="text-red-600">
                  {nonRetryableErrors.length} cannot be retried
                </span>
              )}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default BulkErrorDisplay;
