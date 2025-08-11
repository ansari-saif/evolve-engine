import React from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from './loading-spinner';
import { BulkProgressBar } from './BulkProgressBar';
import { CheckCircle, AlertCircle, Clock, Upload } from 'lucide-react';

export type BulkOperationStage = 
  | 'preparing'
  | 'uploading'
  | 'processing'
  | 'validating'
  | 'creating'
  | 'completed'
  | 'error';

export interface BulkLoadingStateProps {
  /** Current stage of the operation */
  stage: BulkOperationStage;
  /** Current progress percentage (0-100) */
  progress: number;
  /** Total number of items being processed */
  totalItems: number;
  /** Number of items completed */
  completedItems: number;
  /** Number of items that failed */
  failedItems?: number;
  /** Custom status message */
  status?: string;
  /** Error message if any */
  error?: string;
  /** Whether to show detailed progress */
  showDetails?: boolean;
  /** Custom CSS class */
  className?: string;
}

const stageConfig = {
  preparing: {
    icon: Clock,
    title: 'Preparing',
    description: 'Getting ready to process your tasks...',
    color: 'text-blue-600'
  },
  uploading: {
    icon: Upload,
    title: 'Uploading',
    description: 'Sending tasks to the server...',
    color: 'text-blue-600'
  },
  processing: {
    icon: LoadingSpinner,
    title: 'Processing',
    description: 'Processing your tasks...',
    color: 'text-blue-600'
  },
  validating: {
    icon: Clock,
    title: 'Validating',
    description: 'Validating task data...',
    color: 'text-yellow-600'
  },
  creating: {
    icon: LoadingSpinner,
    title: 'Creating',
    description: 'Creating tasks...',
    color: 'text-green-600'
  },
  completed: {
    icon: CheckCircle,
    title: 'Completed',
    description: 'All tasks created successfully!',
    color: 'text-green-600'
  },
  error: {
    icon: AlertCircle,
    title: 'Error',
    description: 'Something went wrong',
    color: 'text-red-600'
  }
};

export const BulkLoadingState: React.FC<BulkLoadingStateProps> = ({
  stage,
  progress,
  totalItems,
  completedItems,
  failedItems = 0,
  status,
  error,
  showDetails = true,
  className = ''
}) => {
  const config = stageConfig[stage];
  const IconComponent = config.icon;
  const isCompleted = stage === 'completed';
  const hasError = stage === 'error';
  const isProcessing = ['preparing', 'uploading', 'processing', 'validating', 'creating'].includes(stage);

  return (
    <div className={cn('space-y-4 p-6 bg-background border rounded-lg', className)}>
      {/* Header with Icon and Title */}
      <div className="flex items-center gap-3">
        <div className={cn('flex-shrink-0', config.color)}>
          {isProcessing ? (
            <LoadingSpinner size="small" message="" />
          ) : (
            <IconComponent className="w-6 h-6" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{config.title}</h3>
          <p className="text-sm text-muted-foreground">
            {status || config.description}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <BulkProgressBar
        progress={progress}
        status={status || config.description}
        isComplete={isCompleted}
        hasError={hasError}
        size="medium"
        showPercentage={true}
      />

      {/* Detailed Progress Information */}
      {showDetails && (
        <div className="space-y-2">
          {/* Progress Stats */}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-medium">
              {completedItems} of {totalItems} tasks
            </span>
          </div>

          {/* Success/Failure Counts */}
          {(completedItems > 0 || failedItems > 0) && (
            <div className="flex gap-4 text-sm">
              {completedItems > 0 && (
                <div className="flex items-center gap-1 text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>{completedItems} created</span>
                </div>
              )}
              {failedItems > 0 && (
                <div className="flex items-center gap-1 text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{failedItems} failed</span>
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <p className="font-medium">Error occurred:</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Completion Summary */}
          {isCompleted && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-green-800">
                  <p className="font-medium">Success!</p>
                  <p className="mt-1">
                    Successfully created {completedItems} task{completedItems !== 1 ? 's' : ''}.
                    {failedItems > 0 && ` ${failedItems} task${failedItems !== 1 ? 's' : ''} failed.`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BulkLoadingState;
