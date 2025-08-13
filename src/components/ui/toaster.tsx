import { useToasts } from "@/hooks/redux/useToasts"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useEffect } from "react"

export function Toaster() {
  const { toasts, dismissToast, removeToast } = useToasts()

  // Auto-dismiss toasts based on their duration
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    toasts.forEach((toast) => {
      if (toast.open && toast.duration && toast.duration > 0) {
        const timeout = setTimeout(() => {
          dismissToast(toast.id);
        }, toast.duration);
        timeouts.push(timeout);
      }
    });

    // Cleanup timeouts on unmount or when toasts change
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [toasts, dismissToast]);

  // Remove dismissed toasts after animation completes
  useEffect(() => {
    const removeTimeouts: NodeJS.Timeout[] = [];

    toasts.forEach((toast) => {
      if (!toast.open) {
        const timeout = setTimeout(() => {
          removeToast(toast.id);
        }, 500); // Wait for animation to complete
        removeTimeouts.push(timeout);
      }
    });

    return () => {
      removeTimeouts.forEach(clearTimeout);
    };
  }, [toasts, removeToast]);

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            onOpenChange={(open) => {
              if (!open) {
                dismissToast(id);
              }
            }}
          >
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
