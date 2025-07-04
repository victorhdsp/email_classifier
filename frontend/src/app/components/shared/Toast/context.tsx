import { createContext, useContext } from 'react';

export interface ToastData {
  title: string;
  description?: string;
  variant?: 'error' | 'success';
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: ToastData) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
};
