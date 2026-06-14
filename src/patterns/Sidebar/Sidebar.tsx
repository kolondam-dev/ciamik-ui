import React from 'react';
import { CaretLeft, CaretRight, X } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './Sidebar.module.css';

export interface SidebarItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

export interface SidebarProps {
  isCollapsed: boolean;
  onCollapseToggle: () => void;
  groups: SidebarGroup[];
  logo?: React.ReactNode;
  footer?: React.ReactNode;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onCollapseToggle,
  groups,
  logo,
  footer,
  isMobileOpen = false,
  onMobileClose,
  className,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={onMobileClose}
          data-testid="sidebar-backdrop"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          styles.sidebar,
          isCollapsed ? styles.collapsed : styles.expanded,
          isMobileOpen && styles.mobileOpen,
          className
        )}
        aria-label="Sidebar navigasi"
      >
        {/* Header (Logo + Toggle Button) */}
        <div className={styles.header}>
          <div className={styles.logoWrapper}>
            {!isCollapsed && logo ? (
              logo
            ) : (
              <span className={styles.logoPlaceholder}>C</span>
            )}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={onCollapseToggle}
            aria-label={isCollapsed ? "Buka sidebar" : "Tutup sidebar"}
            data-testid="sidebar-toggle-btn"
          >
            {isCollapsed ? <CaretRight size={16} weight="bold" /> : <CaretLeft size={16} weight="bold" />}
          </button>

          {/* Mobile Close Button */}
          {onMobileClose && (
            <button
              type="button"
              className={styles.mobileCloseBtn}
              onClick={onMobileClose}
              aria-label="Tutup menu navigasi"
              data-testid="sidebar-mobile-close-btn"
            >
              <X size={18} weight="bold" />
            </button>
          )}
        </div>

        {/* Navigation Content */}
        <div className={styles.content}>
          {groups.map((group, groupIdx) => (
            <div key={`group-${groupIdx}`} className={styles.navGroup}>
              {!isCollapsed && group.title && (
                <h5 className={styles.groupTitle}>{group.title}</h5>
              )}
              <ul className={styles.navList}>
                {group.items.map((item) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      onClick={item.onClick}
                      className={cn(
                        styles.navItem,
                        item.isActive && styles.activeItem
                      )}
                      aria-current={item.isActive ? 'page' : undefined}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <span className={styles.itemIcon}>{item.icon}</span>
                      {!isCollapsed && <span className={styles.itemLabel}>{item.label}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </aside>
    </>
  );
};
