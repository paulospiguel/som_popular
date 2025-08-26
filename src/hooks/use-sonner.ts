import { toast } from "sonner";

interface ToastOptions {
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

export const useSonner = () => {
  const showSuccess = (message: string, options?: ToastOptions) => {
    return toast.success(options?.title || "Sucesso", {
      description: options?.description || message,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const showError = (message: string, options?: ToastOptions) => {
    return toast.error(options?.title || "Erro", {
      description: options?.description || message,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const showInfo = (message: string, options?: ToastOptions) => {
    return toast.info(options?.title || "Informação", {
      description: options?.description || message,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const showWarning = (message: string, options?: ToastOptions) => {
    return toast.warning(options?.title || "Aviso", {
      description: options?.description || message,
      action: options?.action,
      duration: options?.duration,
    });
  };

  const showPromise = <T>(
    promise: Promise<T>,
    options: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(promise, options);
  };

  return {
    showSuccess,
    showError,
    showInfo,
    showWarning,
    showPromise,
  };
};
