import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { X } from '@phosphor-icons/react';
import { useCiamik } from '../../provider';
import styles from './Sheet.module.css';

// closed state = dismiss (translateY 100%)

type SnapState = 'full' | 'half' | 'closed';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  isDismissible?: boolean;
  /** Initial snap point when opened. Defaults to 'half'. */
  initialSnap?: 'half' | 'full';
  translations?: {
    close?: string;
  };
}

export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  isDismissible = true,
  initialSnap = 'half',
  translations,
}) => {
  const { labels } = useCiamik();
  const t = {
    close: translations?.close || labels?.sheet?.close || 'Tutup',
  };

  const sheetRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const [snap, setSnap] = useState<SnapState>(initialSnap);

  // Drag tracking via motion value for smooth spring interpolation
  const dragY = useMotionValue(0);
  const backdropOpacity = useTransform(dragY, [-200, 0, 400], [1, 1, 0.2]);

  // Convert snap state to translateY viewport height offset
  const getTranslateForSnap = (s: SnapState): string => {
    switch (s) {
      case 'full':
        return '0vh';
      case 'half':
        return '35vh';
      case 'closed':
        return '85vh';
    }
  };

  // Lock body scroll + overscroll protection when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.overscrollBehavior = 'none';
      setSnap(initialSnap);
    } else {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.overscrollBehavior = '';
    };
  }, [isOpen, initialSnap]);

  // Touch‐move guard: prevent accidental pull-to-refresh on mobile
  useEffect(() => {
    if (!isOpen) return;

    const handler = (e: TouchEvent) => {
      // Allow scrolling inside body content
      const bodyEl = bodyRef.current;
      if (bodyEl && bodyEl.contains(e.target as Node)) {
        // If body is at top and trying to scroll up further → prevent
        if (bodyEl.scrollTop <= 0) {
          const touch = e.touches[0];
          if (touch) {
            // We'll let the drag handle manage it
          }
        }
        return;
      }
      // Prevent default on backdrop/handle area to avoid pull-to-refresh
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    document.addEventListener('touchmove', handler, { passive: false });
    return () => document.removeEventListener('touchmove', handler);
  }, [isOpen]);

  const handleDragEnd = useCallback((_: any, info: any) => {
    if (!isDismissible && snap === 'half') {
      // Non-dismissible: can only go up
      if (info.offset.y < -60 || info.velocity.y < -200) {
        setSnap('full');
      }
      return;
    }

    const dragThreshold = 60;
    const velocityThreshold = 250;

    const offsetY = info.offset.y;
    const velocityY = info.velocity.y;

    if (snap === 'half') {
      if (offsetY < -dragThreshold || velocityY < -velocityThreshold) {
        // Drag up → Full
        setSnap('full');
      } else if (offsetY > dragThreshold || velocityY > velocityThreshold) {
        // Drag down → Close/Dismiss
        setSnap('closed');
        // Small delay to let animation finish
        setTimeout(() => onClose(), 300);
      }
    } else if (snap === 'full') {
      if (offsetY > dragThreshold * 2 || velocityY > velocityThreshold * 1.5) {
        // Large drag down from full → close directly
        setSnap('closed');
        setTimeout(() => onClose(), 300);
      } else if (offsetY > dragThreshold || velocityY > velocityThreshold) {
        // Moderate drag down → go to half
        setSnap('half');
      }
    }
  }, [snap, isDismissible, onClose]);

  const sheetRoot = typeof document !== 'undefined' ? document.body : null;

  const sheetContent = (
    <AnimatePresence
      onExitComplete={() => {
        setSnap(initialSnap);
      }}
    >
      {isOpen && snap !== 'closed' && (
        <div className={styles.overlay} role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={isDismissible ? onClose : undefined}
            style={{ opacity: backdropOpacity }}
          />

          {/* Bottom Sheet Card */}
          <motion.div
            ref={sheetRef}
            className={styles.sheetBox}
            data-snap={snap}
            initial={{ y: '85vh' }}
            animate={{ y: getTranslateForSnap(snap) }}
            exit={{ y: '85vh' }}
            transition={{
              type: 'spring',
              damping: 32,
              stiffness: 300,
              mass: 0.8,
            }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
            style={{ y: dragY }}
          >
            {/* Drag Handle Container */}
            <div
              className={styles.handleContainer}
              onPointerDown={(e) => dragControls.start(e)}
              style={{ cursor: isDismissible ? 'grab' : 'default', touchAction: 'none' }}
            >
              <div className={styles.handle} />
            </div>

            {/* Snap indicator dots */}
            <div className={styles.snapIndicator}>
              {(['full', 'half'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`${styles.snapDot} ${snap === s ? styles.snapDotActive : ''}`}
                  onClick={() => setSnap(s)}
                  aria-label={`Snap ke ${s}`}
                />
              ))}
            </div>

            {/* Header */}
            {title && (
              <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                {isDismissible && (
                  <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t.close}>
                    <X size={18} weight="bold" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Content */}
            <div ref={bodyRef} className={styles.body}>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  if (!sheetRoot) return null;

  return createPortal(sheetContent, sheetRoot);
};
