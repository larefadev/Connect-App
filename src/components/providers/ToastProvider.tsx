"use client";

import { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/ui/ToastContainer';

interface ToastContextType {
  // Core methods
  showToast: (message: string, type?: 'success' | 'error' | 'info' | 'warning', options?: any) => string;
  removeToast: (id: string) => void;
  removeAllToasts: () => void;
  
  // Convenience methods
  success: (message: string, options?: any) => string;
  error: (message: string, options?: any) => string;
  info: (message: string, options?: any) => string;
  warning: (message: string, options?: any) => string;
  
  // Specialized methods
  addToCart: (productName: string, quantity?: number) => string;
  orderCreated: (orderNumber: string) => string;
  networkError: (message?: string) => string;
  
  // State
  toasts: any[];
  hasToasts: boolean;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export { ToastContext };

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
  maxToasts?: number;
}

export const ToastProvider = ({ 
  children, 
  position = 'top-right',
  maxToasts = 5 
}: ToastProviderProps) => {
  const toastUtils = useToast();

  return (
    <ToastContext.Provider value={toastUtils}>
      {children}
      <ToastContainer 
        toasts={toastUtils.toasts}
        onRemove={toastUtils.removeToast}
        position={position}
        maxToasts={maxToasts}
      />
    </ToastContext.Provider>
  );
};
