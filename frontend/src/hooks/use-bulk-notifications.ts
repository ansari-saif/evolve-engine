import { useToast } from './use-toast';

export interface BulkNotificationOptions {
  /** Number of tasks successfully created */
  successCount: number;
  /** Number of tasks that failed */
  errorCount?: number;
  /** Total number of tasks attempted */
  totalCount: number;
  /** Error message if any */
  errorMessage?: string;
  /** Function to retry the operation */
  onRetry?: () => void;
  /** Function to dismiss the notification */
  onDismiss?: () => void;
  /** Custom title for the notification */
  title?: string;
  /** Custom description for the notification */
  description?: string;
  /** Duration in milliseconds before auto-dismiss (default: 5000) */
  duration?: number;
}

export interface BulkProgressNotificationOptions {
  /** Current progress percentage */
  progress: number;
  /** Current stage of the operation */
  stage: string;
  /** Total number of tasks */
  totalCount: number;
  /** Number of completed tasks */
  completedCount: number;
  /** Function to cancel the operation */
  onCancel?: () => void;
}

type ToastResult = {
  id: string;
  dismiss: () => void;
  update: (props: { title?: string; description?: string; duration?: number; variant?: string }) => void;
};

export function useBulkNotifications() {
  const { toast } = useToast();

  const showSuccessNotification = (options: BulkNotificationOptions) => {
    const {
      successCount,
      errorCount = 0,
      totalCount,
      title,
      description,
      onRetry,
      onDismiss,
      duration = 5000
    } = options;

    const defaultTitle = errorCount > 0 
      ? `Partial Success: ${successCount} of ${totalCount} tasks created`
      : `Success: ${successCount} task${successCount !== 1 ? 's' : ''} created`;

    const defaultDescription = errorCount > 0
      ? `${errorCount} task${errorCount !== 1 ? 's' : ''} failed to create.`
      : `All tasks have been successfully created.`;

    const toastResult = toast({
      title: title || defaultTitle,
      description: description || defaultDescription,
      duration,
      variant: errorCount > 0 ? 'default' : 'default',
      onOpenChange: (open) => {
        if (!open && onDismiss) {
          onDismiss();
        }
      }
    });

    // If retry is available, show a separate toast for it
    if (onRetry) {
      setTimeout(() => {
        toast({
          title: "Retry Available",
          description: "Click to retry failed tasks",
          duration: 3000
        });
      }, 1000);
    }

    return toastResult;
  };

  const showErrorNotification = (options: BulkNotificationOptions) => {
    const {
      errorCount = 0,
      totalCount,
      errorMessage,
      onRetry,
      onDismiss,
      duration = 8000
    } = options;

    const defaultTitle = `Error: Failed to create ${errorCount || totalCount} task${(errorCount || totalCount) !== 1 ? 's' : ''}`;
    const defaultDescription = errorMessage || 'An error occurred while creating the tasks. Please try again.';

    const toastResult = toast({
      title: defaultTitle,
      description: defaultDescription,
      duration,
      variant: 'destructive',
      onOpenChange: (open) => {
        if (!open && onDismiss) {
          onDismiss();
        }
      }
    });

    // If retry is available, show a separate toast for it
    if (onRetry) {
      setTimeout(() => {
        toast({
          title: "Retry Available",
          description: "Click to retry the operation",
          duration: 5000
        });
      }, 1000);
    }

    return toastResult;
  };

  const showProgressNotification = (options: BulkProgressNotificationOptions) => {
    const {
      progress,
      stage,
      totalCount,
      completedCount,
      onCancel
    } = options;

    const toastResult = toast({
      title: "Creating Tasks...",
      description: `${stage}: ${completedCount} of ${totalCount} tasks (${Math.round(progress)}%)`,
      duration: Infinity, // Don't auto-dismiss progress notifications
      onOpenChange: (open) => {
        if (!open && onCancel) {
          onCancel();
        }
      }
    });

    return toastResult;
  };

  const updateProgressNotification = (toastResult: ToastResult, options: BulkProgressNotificationOptions) => {
    const {
      progress,
      stage,
      totalCount,
      completedCount
    } = options;

    // Update the existing toast using the update method
    if (toastResult && toastResult.update) {
      toastResult.update({
        title: "Creating Tasks...",
        description: `${stage}: ${completedCount} of ${totalCount} tasks (${Math.round(progress)}%)`
      });
    }
  };

  const dismissProgressNotification = (toastResult: ToastResult) => {
    // Dismiss the toast using the dismiss method
    if (toastResult && toastResult.dismiss) {
      toastResult.dismiss();
    }
  };

  return {
    showSuccessNotification,
    showErrorNotification,
    showProgressNotification,
    updateProgressNotification,
    dismissProgressNotification
  };
}
