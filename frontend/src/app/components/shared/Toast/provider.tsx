import { useState, useCallback } from 'react';
import * as RadixToast from '@radix-ui/react-toast';
import { ToastContext, ToastData } from './context';
import { ToastItem } from './item';
import styles from './item.module.scss';

export interface ToastMessage extends ToastData {
  id: string;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((data: ToastData) => {
    setToasts((prevToasts) => [
      ...prevToasts,
      { ...data, id: new Date().toISOString() },
    ]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      <RadixToast.Provider swipeDirection="right">
        {children}
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            data={toast}
            onClose={() => removeToast(toast.id)}
          />
        ))}
        <RadixToast.Viewport className={styles.viewport} />
      </RadixToast.Provider>
    </ToastContext.Provider>
  );
}

