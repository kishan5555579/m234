import { useState, useCallback } from "react";
import { toast as sonnerToast } from "sonner";

export interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  title?: string;
  description?: string;
  duration?: number;
}

interface ToastOptions {
  title?: string;
  description?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };

    setToasts(prev => [...prev, newToast]);

    // Auto remove after duration
    setTimeout(() => {
      removeToast(id);
    }, toast.duration || 5000);

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const toast = {
    success: (message: string, options?: ToastOptions) => {
      addToast({
        type: "success",
        message,
        title: options?.title,
        description: options?.description,
        duration: options?.duration || 3000,
      });

      // Also use Sonner for backward compatibility
      sonnerToast.success(message, {
        description: options?.description,
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    error: (message: string, options?: ToastOptions) => {
      addToast({
        type: "error",
        message,
        title: options?.title,
        description: options?.description,
        duration: options?.duration || 4000,
      });

      sonnerToast.error(message, {
        description: options?.description,
        duration: options?.duration || 4000,
        action: options?.action,
      });
    },
    info: (message: string, options?: ToastOptions) => {
      addToast({
        type: "info",
        message,
        title: options?.title,
        description: options?.description,
        duration: options?.duration || 3000,
      });

      sonnerToast.info(message, {
        description: options?.description,
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    warning: (message: string, options?: ToastOptions) => {
      addToast({
        type: "warning",
        message,
        title: options?.title,
        description: options?.description,
        duration: options?.duration || 3000,
      });

      sonnerToast.warning(message, {
        description: options?.description,
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    loading: (message: string, options?: ToastOptions) => {
      return sonnerToast.loading(message, {
        description: options?.description,
      });
    },
    dismiss: (toastId?: string | number) => {
      sonnerToast.dismiss(toastId);
    },
    custom: (component: React.ReactNode, options?: ToastOptions) => {
      sonnerToast.custom(component, {
        duration: options?.duration || 3000,
      });
    },
    toasts,
    removeToast,
  };

  return { toast };
};

// Legacy export for backward compatibility
export { useToast as default };
