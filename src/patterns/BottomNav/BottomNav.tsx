import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';
import styles from './BottomNav.module.css';

export interface BottomNavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
  badgeCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({ items, className }) => {
  return (
    <nav className={cn(styles.bottomNav, className)} aria-label="Bottom Navigation">
      <div className={styles.container}>
        {items.map((item) => {
          const hasBadge = item.badgeCount !== undefined && item.badgeCount > 0;

          return (
            <motion.button
              key={item.key}
              type="button"
              className={cn(styles.navBtn, item.isActive && styles.activeBtn)}
              onClick={item.onClick}
              whileTap={{ scale: 0.90 }} // micro-animation: scale on tap
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
            >
              <div className={styles.iconContainer}>
                {item.icon}
                {hasBadge && (
                  <span className={styles.badge} data-testid={`badge-${item.key}`}>
                    {item.badgeCount! > 99 ? '99+' : item.badgeCount}
                  </span>
                )}
              </div>
              <span className={styles.label}>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
