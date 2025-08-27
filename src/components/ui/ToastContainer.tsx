"use client";

import { useEffect, useState } from 'react';
import { CheckCircle, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toast, ToastType } from '@/hooks/useToast';

interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
  className?: string;
}

const getPositionClasses = (position: string) => {
  switch (position) {
    case 'top-left':
      return 'top-4 left-4';
    case 'top-center':
      return 'top-4 left-1/2 transform -translate-x-1/2';
    case 'bottom-left':
      return 'bottom-4 left-4';
    case 'bottom-center':
      return 'bottom-4 left-1/2 transform -translate-x-1/2';
    case 'bottom-right':
      return 'bottom-4 right-4';
    default: // top-right
      return 'top-4 right-4';
  }
};

const getToastStyles = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        container: 'bg-green-50 border-green-200 text-green-800',
        icon: 'text-green-500',
        progress: 'bg-green-500',
      };
    case 'error':
      return {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-500',
        progress: 'bg-red-500',
      };
    case 'warning':
      return {
        container: 'bg-yellow-50 border-yellow-200 text-yellow-800',
        icon: 'text-yellow-500',
        progress: 'bg-yellow-500',
      };
    case 'info':
    default:
      return {
        container: 'bg-blue-50 border-blue-200 text-blue-800',
        icon: 'text-blue-500',
        progress: 'bg-blue-500',
      };
  }
};

const getIcon = (type: ToastType) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="w-5 h-5" />;
    case 'error':
      return <X className="w-5 h-5" />;
    case 'warning':
      return <AlertTriangle className="w-5 h-5" />;
    case 'info':
    default:
      return <Info className="w-5 h-5" />;
  }
};

export const ToastContainer = ({ 
  toasts, 
  onRemove, 
  position = 'top-right',
  maxToasts = 5,
  className 
}: ToastContainerProps) => {
  const [visibleToasts, setVisibleToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Limitar el número de toasts visibles
    setVisibleToasts(toasts.slice(-maxToasts));
  }, [toasts, maxToasts]);

  if (visibleToasts.length === 0) return null;

  return (
    <div className={cn(
      'fixed z-50 space-y-2',
      getPositionClasses(position),
      className
    )}>
      {visibleToasts.map((toast) => (
        <ToastItem 
          key={toast.id} 
          toast={toast} 
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const styles = getToastStyles(toast.type);

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + toast.duration;
      
      const updateProgress = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const newProgress = (remaining / (toast.duration || 1)) * 100;
        
        if (newProgress <= 0) {
          handleClose();
        } else {
          setProgress(newProgress);
          requestAnimationFrame(updateProgress);
        }
      };
      
      requestAnimationFrame(updateProgress);
    }
  }, [toast.duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onRemove(toast.id);
    }, 300); // Delay para la animación de salida
  };

  return (
    <div
      className={cn(
        'max-w-sm w-full p-4 rounded-lg border shadow-lg transition-all duration-300',
        styles.container,
        isVisible ? 'translate-x-0 opacity-100 scale-100' : 'translate-x-full opacity-0 scale-95'
      )}
    >
      {/* Progress Bar */}
      {toast.duration && toast.duration > 0 && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 rounded-t-lg overflow-hidden">
          <div 
            className={cn('h-full transition-all duration-100 ease-linear', styles.progress)}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      <div className="flex items-start space-x-3">
        <div className={cn('flex-shrink-0', styles.icon)}>
          {getIcon(toast.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          {toast.title && (
            <h4 className="text-sm font-semibold mb-1">{toast.title}</h4>
          )}
          <p className="text-sm">{toast.message}</p>
          
          {toast.action && (
            <button
              onClick={toast.action.onClick}
              className="mt-2 text-xs font-medium underline hover:no-underline transition-all"
            >
              {toast.action.label}
            </button>
          )}
        </div>
        
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
