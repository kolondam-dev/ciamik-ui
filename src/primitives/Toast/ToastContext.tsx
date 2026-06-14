import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Toast } from './Toast';
import styles from './Toast.module.css';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => {
        // Limit max 3 visible toasts, remove first if exceeded
        const next = [...prev, { id, message, type }];
        if (next.length > 3) {
          return next.slice(next.length - 3);
        }
        return next;
      });

      // Auto dismiss after 3.5s
      setTimeout(() => {
        removeToast(id);
      }, 3500);
    },
    [removeToast]
  );

  const value = useMemo(() => ({ toast: triggerToast }), [triggerToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className={styles.container} aria-live="polite">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            id={t.id}
            message={t.message}
            type={t.type}
            onClose={removeToast}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};
