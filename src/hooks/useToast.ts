import { useState, useCallback, useRef } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastOptions {
  duration?: number;
  title?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const useToast = () => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const toastCount = useRef(0);

  const generateId = useCallback(() => {
    toastCount.current += 1;
    return `toast-${Date.now()}-${toastCount.current}`;
  }, []);

  const showToast = useCallback((
    message: string, 
    type: ToastType = 'info', 
    options: ToastOptions = {}
  ) => {
    const id = generateId();
    const { duration = 5000, title, action } = options;

    const newToast: Toast = {
      id,
      message,
      type,
      duration,
      title,
      action,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [generateId]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods for different toast types
  const success = useCallback((message: string, options?: ToastOptions) => {
    return showToast(message, 'success', options);
  }, [showToast]);

  const error = useCallback((message: string, options?: ToastOptions) => {
    return showToast(message, 'error', options);
  }, [showToast]);

  const info = useCallback((message: string, options?: ToastOptions) => {
    return showToast(message, 'info', options);
  }, [showToast]);

  const warning = useCallback((message: string, options?: ToastOptions) => {
    return showToast(message, 'warning', options);
  }, [showToast]);

  // Specialized methods for common use cases
  const addToCart = useCallback((productName: string, quantity: number = 1) => {
    const message = quantity === 1 
      ? `${productName} agregado al carrito`
      : `${quantity} ${quantity === 1 ? 'unidad' : 'unidades'} de ${productName} agregadas al carrito`;
    
    return success(message, {
      title: 'Producto Agregado',
      duration: 3000,
    });
  }, [success]);

  const orderCreated = useCallback((orderNumber: string) => {
    return success(`Pedido #${orderNumber} creado exitosamente`, {
      title: 'Pedido Confirmado',
      duration: 5000,
      action: {
        label: 'Ver Pedido',
        onClick: () => {
          // Aquí podrías navegar a la página del pedido
          console.log('Navegar al pedido:', orderNumber);
        }
      }
    });
  }, [success]);

  const networkError = useCallback((message: string = 'Error de conexión') => {
    return error(message, {
      title: 'Error de Red',
      duration: 7000,
      action: {
        label: 'Reintentar',
        onClick: () => {
          // Aquí podrías implementar la lógica de reintento
          console.log('Reintentando operación...');
        }
      }
    });
  }, [error]);

  return {
    // Core methods
    showToast,
    removeToast,
    removeAllToasts,
    
    // Convenience methods
    success,
    error,
    info,
    warning,
    
    // Specialized methods
    addToCart,
    orderCreated,
    networkError,
    
    // State
    toasts,
    hasToasts: toasts.length > 0,
  };
};
