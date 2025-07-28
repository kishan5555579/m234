import { toast as sonnerToast } from "sonner";

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
  const toast = {
    success: (message: string, options?: ToastOptions) => {
      sonnerToast.success(message, {
        description: options?.description,
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    error: (message: string, options?: ToastOptions) => {
      sonnerToast.error(message, {
        description: options?.description,
        duration: options?.duration || 4000,
        action: options?.action,
      });
    },
    info: (message: string, options?: ToastOptions) => {
      sonnerToast.info(message, {
        description: options?.description,
        duration: options?.duration || 3000,
        action: options?.action,
      });
    },
    warning: (message: string, options?: ToastOptions) => {
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
  };

  return { toast };
};

// Legacy export for backward compatibility
export { useToast as default };
