import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ErrorDisplayProps {
  error: string | null;
  onDismiss?: () => void;
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ 
  error, 
  onDismiss, 
  className 
}) => {
  if (!error) return null;

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-md",
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-destructive font-medium">{error}</p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
          aria-label="Dismiss error"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
