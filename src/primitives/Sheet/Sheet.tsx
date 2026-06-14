import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './Sheet.module.css';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isDismissible?: boolean;
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDismissible = true,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

  // Lock scroll on body when open
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

  const sheetRoot = typeof document !== 'undefined' ? document.body : null;

  const handleDragEnd = (event: any, info: any) => {
    if (!isDismissible) return;
    // Close if dragged down more than 100px or speed is fast downwards
    if (info.offset.y > 100 || info.velocity.y > 500) {
      onClose();
    }
  };

  const sheetContent = (
    <AnimatePresence>
      {isOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={isDismissible ? onClose : undefined}
          />

          {/* Bottom Sheet Card */}
          <motion.div
            ref={sheetRef}
            className={styles.sheetBox}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            drag="y"
            dragControls={dragControls}
            dragListener={false} // Only drag by handle
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.8 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag Handle Container */}
            <div
              className={styles.handleContainer}
              onPointerDown={(e) => dragControls.start(e)}
              style={{ cursor: isDismissible ? 'grab' : 'default' }}
            >
              <div className={styles.handle} />
            </div>

            {/* Header */}
            {title && (
              <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                {isDismissible && (
                  <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Tutup">
                    <X size={18} weight="bold" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content */}
            <div className={styles.body}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!sheetRoot) return null;

  return createPortal(sheetContent, sheetRoot);
};
