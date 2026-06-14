import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Spinner.module.css';

export interface SpinnerProps extends React.HTMLAttributes<HTMLSpanElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'accent' | 'neutral' | 'current';
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(
  ({ className, size = 'md', variant = 'primary', ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(styles.spinner, styles[size], styles[variant], className)}
        {...props}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeDasharray="32"
            strokeDashoffset="8"
            className={styles.circle}
          />
        </svg>
      </span>
    );
  }
);

Spinner.displayName = 'Spinner';
