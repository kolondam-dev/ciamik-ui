import React from 'react';
import { cn } from '../../utils';
import { CheckCircle, Warning, XCircle, Info, X } from '@phosphor-icons/react';
import styles from './Toast.module.css';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  onClose: (id: string) => void;
}

const ICONS = {
  success: <CheckCircle size={20} weight="fill" className={styles.successIcon} />,
  warning: <Warning size={20} weight="fill" className={styles.warningIcon} />,
  error: <XCircle size={20} weight="fill" className={styles.errorIcon} />,
  info: <Info size={20} weight="fill" className={styles.infoIcon} />,
};

export const Toast: React.FC<ToastProps> = ({ id, message, type = 'info', onClose }) => {
  return (
    <div className={cn(styles.toast, styles[type])} role="status">
      <div className={styles.icon}>{ICONS[type]}</div>
      <div className={styles.message}>{message}</div>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={() => onClose(id)}
        aria-label="Tutup"
      >
        <X size={14} weight="bold" />
      </button>
    </div>
  );
};
