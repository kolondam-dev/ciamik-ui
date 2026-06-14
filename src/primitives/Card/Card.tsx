import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Card.module.css';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, interactive = false, header, footer, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(styles.card, interactive && styles.interactive, className)}
        {...props}
      >
        {header && <div className={styles.header}>{header}</div>}
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    );
  }
);

Card.displayName = 'Card';
