import React from 'react';
import { cn } from '@/lib/utils';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from './badge';
import type { OptimisticTask } from '../../hooks/use-optimistic-tasks';

export interface OptimisticTaskIndicatorProps {
  /** Optimistic task to display */
  task: OptimisticTask;
  /** Whether the task is being processed */
  isProcessing?: boolean;
  /** Whether there was an error with this task */
  hasError?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Function to retry this specific task */
  onRetry?: (task: OptimisticTask) => void;
  /** Function to dismiss this optimistic task */
  onDismiss?: (taskId: number) => void;
}

export const OptimisticTaskIndicator: React.FC<OptimisticTaskIndicatorProps> = ({
  task,
  isProcessing = false,
  hasError = false,
  className = '',
  onRetry,
  onDismiss
}) => {
  const getStatusIcon = () => {
    if (hasError) {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    if (isProcessing) {
      return <Clock className="w-4 h-4 text-blue-500 animate-pulse" />;
    }
    return <CheckCircle className="w-4 h-4 text-green-500" />;
  };

  const getStatusText = () => {
    if (hasError) {
      return 'Failed to create';
    }
    if (isProcessing) {
      return 'Creating...';
    }
    return 'Created';
  };

  const getStatusColor = () => {
    if (hasError) {
      return 'bg-red-50 border-red-200 text-red-800';
    }
    if (isProcessing) {
      return 'bg-blue-50 border-blue-200 text-blue-800';
    }
    return 'bg-green-50 border-green-200 text-green-800';
  };

  return (
    <div className={cn(
      'p-3 border rounded-lg transition-all duration-200',
      getStatusColor(),
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {getStatusIcon()}
            <span className="text-sm font-medium">{getStatusText()}</span>
            <Badge variant="outline" className="text-xs">
              Optimistic
            </Badge>
          </div>
          
          <h4 className="text-sm font-medium text-gray-900 mb-1">
            {task.description}
          </h4>
          
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>Priority: {task.priority}</span>
            <span>•</span>
            <span>Energy: {task.energy_required}</span>
            {task.scheduled_for_date && (
              <>
                <span>•</span>
                <span>Scheduled: {new Date(task.scheduled_for_date).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          {hasError && onRetry && (
            <button
              onClick={() => onRetry(task)}
              className="p-1 text-red-600 hover:text-red-800 hover:bg-red-100 rounded transition-colors"
              title="Retry this task"
            >
              <AlertCircle className="w-4 h-4" />
            </button>
          )}
          
          {onDismiss && (
            <button
              onClick={() => onDismiss(task.task_id)}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
              title="Dismiss this task"
            >
              <span className="text-lg leading-none">&times;</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OptimisticTaskIndicator;
