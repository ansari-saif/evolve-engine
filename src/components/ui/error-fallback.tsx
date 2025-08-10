import React from 'react';
import { Button } from './button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorFallbackProps {
  error: unknown;
  resetErrorBoundary?: () => void;
  className?: string;
  showRetry?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetErrorBoundary,
  className,
  showRetry = true
}) => {
  const errorMessage = error instanceof Error ? error.message : 'Something went wrong';

  return (
    <div className={cn(
      'flex flex-col items-center justify-center p-6 text-center',
      className
    )}>
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        Oops! Something went wrong
      </h2>
      <p className="text-gray-600 mb-4 max-w-md">
        {errorMessage}
      </p>
      {showRetry && resetErrorBoundary && (
        <Button
          onClick={resetErrorBoundary}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </Button>
      )}
    </div>
  );
};

interface ErrorMessageProps {
  message: string;
  className?: string;
  variant?: 'default' | 'destructive';
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  className,
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'text-red-600 bg-red-50 border-red-200',
    destructive: 'text-red-800 bg-red-100 border-red-300'
  };

  return (
    <div className={cn(
      'p-3 rounded-md border text-sm',
      variantClasses[variant],
      className
    )}>
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4" />
        <span>{message}</span>
      </div>
    </div>
  );
};
