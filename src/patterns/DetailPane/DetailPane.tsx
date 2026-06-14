import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretUp, CaretDown } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './DetailPane.module.css';

export interface DetailPaneTab {
  key: string;
  label: string;
}

export interface DetailPaneProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  mode?: 'overlay' | 'push';
  tabs?: DetailPaneTab[];
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  hasNavigation?: boolean;
  onPrevRecord?: () => void;
  onNextRecord?: () => void;
  prevDisabled?: boolean;
  nextDisabled?: boolean;
  className?: string;
}

export const DetailPane: React.FC<DetailPaneProps> = ({
  isOpen,
  onClose,
  title,
  children,
  mode = 'overlay',
  tabs = [],
  activeTab,
  onTabChange,
  hasNavigation = false,
  onPrevRecord,
  onNextRecord,
  prevDisabled = false,
  nextDisabled = false,
  className,
}) => {
  // Lock body scroll in overlay mode
  useEffect(() => {
    if (isOpen && mode === 'overlay') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, mode]);

  const showTabs = tabs.length > 0 && activeTab && onTabChange;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for overlay mode */}
          {mode === 'overlay' && (
            <motion.div
              className={styles.backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              data-testid="detail-pane-backdrop"
            />
          )}

          {/* Pane Container */}
          <motion.div
            className={cn(
              styles.pane,
              mode === 'push' ? styles.pushMode : styles.overlayMode,
              className
            )}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            role="complementary"
            aria-label="Detail Panel"
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.titleWrapper}>
                <h3 className={styles.title}>{title}</h3>
                {hasNavigation && (
                  <div className={styles.navButtons}>
                    <button
                      type="button"
                      disabled={prevDisabled}
                      onClick={onPrevRecord}
                      className={styles.navBtn}
                      aria-label="Rekor sebelumnya"
                      data-testid="pane-prev-btn"
                    >
                      <CaretUp size={16} weight="bold" />
                    </button>
                    <button
                      type="button"
                      disabled={nextDisabled}
                      onClick={onNextRecord}
                      className={styles.navBtn}
                      aria-label="Rekor berikutnya"
                      data-testid="pane-next-btn"
                    >
                      <CaretDown size={16} weight="bold" />
                    </button>
                  </div>
                )}
              </div>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={onClose}
                aria-label="Tutup panel"
                data-testid="pane-close-btn"
              >
                <X size={18} weight="bold" />
              </button>
            </div>

            {/* Tabs */}
            {showTabs && (
              <div className={styles.tabsRow} role="tablist">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <button
                      key={tab.key}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => onTabChange(tab.key)}
                      className={cn(styles.tabBtn, isActive && styles.activeTabBtn)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Scrollable Content */}
            <div className={styles.body}>{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
