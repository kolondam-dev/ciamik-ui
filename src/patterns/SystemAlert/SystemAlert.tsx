import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Warning, XCircle, Info, X } from '@phosphor-icons/react';
import { cn } from '../../utils';
import { useCiamik } from '../../provider';
import styles from './SystemAlert.module.css';

export interface SystemAlertProps {
  isOpen: boolean;
  onClose: () => void;
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  children?: React.ReactNode;
  sidebarOffset?: boolean; // if sidebar is expanded, shifts position
  autoDismissMs?: number;
  translations?: {
    close?: string;
  };
}

const DEFAULT_ICONS = {
  success: <CheckCircle size={20} weight="fill" />,
  warning: <Warning size={20} weight="fill" />,
  danger: <XCircle size={20} weight="fill" />,
  info: <Info size={20} weight="fill" />,
};

export const SystemAlert: React.FC<SystemAlertProps> = ({
  isOpen,
  onClose,
  variant = 'info',
  title,
  children,
  sidebarOffset = false,
  autoDismissMs,
  translations,
}) => {
  const { labels } = useCiamik();
  const t = {
    close: translations?.close || labels?.systemAlert?.close || 'Tutup',
  };

  // Auto-dismiss handler
  useEffect(() => {
    if (isOpen && autoDismissMs) {
      const timer = setTimeout(() => {
        onClose();
      }, autoDismissMs);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoDismissMs, onClose]);

  const icon = DEFAULT_ICONS[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={cn(
            styles.alertWrapper,
            sidebarOffset && styles.sidebarOffset,
            styles[variant]
          )}
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 150 }}
          role="alert"
        >
          <div className={styles.container}>
            <div className={styles.iconWrapper}>{icon}</div>
            <div className={styles.content}>
              {title && <h5 className={styles.title}>{title}</h5>}
              {children && <div className={styles.body}>{children}</div>}
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label={t.close}
              data-testid="alert-close-btn"
            >
              <X size={16} weight="bold" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
