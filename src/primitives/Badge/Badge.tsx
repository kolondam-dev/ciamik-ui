import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Badge.module.css';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' | 'highlight';
  pill?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'neutral', pill = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          styles.badge,
          styles[variant],
          pill && styles.pill,
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
