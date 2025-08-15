import React from 'react';
import { Progress } from './progress';
import { cn } from '@/lib/utils';
import { CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export interface BulkProgressBarProps {
  /** Current progress percentage (0-100) */
  progress: number;
  /** Status text to display */
  status?: string;
  /** Whether the operation is complete */
  isComplete?: boolean;
  /** Whether there was an error */
  hasError?: boolean;
  /** Custom CSS class */
  className?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large';
  /** Show percentage text */
  showPercentage?: boolean;
  /** Custom color for the progress bar */
  color?: 'default' | 'success' | 'warning' | 'error';
}

export const BulkProgressBar: React.FC<BulkProgressBarProps> = ({
  progress,
  status,
  isComplete = false,
  hasError = false,
  className = '',
  size = 'medium',
  showPercentage = true,
  color = 'default'
}) => {
  // Ensure progress is between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress));
  
  // Size-based styling
  const sizeClasses = {
    small: 'h-2',
    medium: 'h-3',
    large: 'h-4'
  };

  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  // Color-based styling
  const colorClasses = {
    default: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500'
  };

  const statusColorClasses = {
    default: 'text-muted-foreground',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  // Determine the actual color based on state
  const actualColor = hasError ? 'error' : isComplete ? 'success' : color;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Progress Bar */}
      <div className="relative">
        <Progress
          value={clampedProgress}
          className={cn(
            sizeClasses[size],
            'transition-all duration-300 ease-out'
          )}
        />
        
        {/* Custom progress indicator with color */}
        <div
          className={cn(
            'absolute top-0 left-0 h-full rounded-full transition-all duration-300 ease-out',
            colorClasses[actualColor]
          )}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Progress: ${clampedProgress}%`}
        />
      </div>

      {/* Status and Percentage */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Status Icon */}
          {hasError ? (
            <AlertCircle className={cn('w-4 h-4', statusColorClasses[actualColor])} data-testid="alert-icon" />
          ) : isComplete ? (
            <CheckCircle className={cn('w-4 h-4', statusColorClasses[actualColor])} data-testid="check-icon" />
          ) : (
            <Loader2 className={cn('w-4 h-4 animate-spin', statusColorClasses[actualColor])} data-testid="loader-icon" />
          )}
          
          {/* Status Text */}
          <span className={cn(
            textSizeClasses[size],
            'font-medium',
            statusColorClasses[actualColor]
          )}>
            {status || (hasError ? 'Error occurred' : isComplete ? 'Completed' : 'Processing...')}
          </span>
        </div>

        {/* Percentage */}
        {showPercentage && (
          <span className={cn(
            textSizeClasses[size],
            'font-mono font-medium',
            statusColorClasses[actualColor]
          )}>
            {Math.round(clampedProgress)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default BulkProgressBar;
