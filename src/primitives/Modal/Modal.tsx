import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Warning } from '@phosphor-icons/react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { useCiamik } from '../../provider';
import styles from './Modal.module.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  destructive?: boolean;
  destructiveActionLabel?: string;
  onDestructiveAction?: () => void;
  confirmLabel?: string;
  onConfirm?: () => void;
  cancelLabel?: string;
  translations?: {
    close?: string;
    confirm?: string;
    cancel?: string;
  };
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  destructive = false,
  destructiveActionLabel,
  onDestructiveAction,
  confirmLabel,
  onConfirm,
  cancelLabel,
  translations,
}) => {
  const { labels } = useCiamik();
  const t = {
    close: translations?.close || labels?.modal?.close || 'Tutup',
    confirm: confirmLabel || translations?.confirm || labels?.modal?.confirm || 'Konfirmasi',
    cancel: cancelLabel || translations?.cancel || labels?.modal?.cancel || 'Batal',
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const modalRoot = typeof document !== 'undefined' ? document.body : null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal Box */}
          <motion.div
            className={cn(styles.modalBox, destructive && styles.destructiveModal)}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.titleWrapper}>
                {destructive && <Warning size={20} weight="fill" className={styles.warningIcon} />}
                <h3 className={styles.title}>{title}</h3>
              </div>
              <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.close}>
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Body */}
            <div className={styles.body}>{children}</div>

            {/* Footer */}
            <div className={styles.footer}>
              {footer ? (
                footer
              ) : (
                <div className={styles.defaultFooterActions}>
                  <Button variant="secondary" onClick={onClose} size="md">
                    {t.cancel}
                  </Button>
                  {destructive && onDestructiveAction && (
                    <Button variant="danger" onClick={onDestructiveAction} size="md">
                      {destructiveActionLabel || 'Hapus'}
                    </Button>
                  )}
                  {!destructive && onConfirm && (
                    <Button variant="primary" onClick={onConfirm} size="md">
                      {t.confirm}
                    </Button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!modalRoot) return null;

  return createPortal(modalContent, modalRoot);
};
