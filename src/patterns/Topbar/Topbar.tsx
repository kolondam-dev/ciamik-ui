import React from 'react';
import { cn } from '../../utils';
import styles from './Topbar.module.css';

export interface TopbarProps extends React.HTMLAttributes<HTMLElement> {
  leftNode?: React.ReactNode;
  centerNode?: React.ReactNode;
  rightNode?: React.ReactNode;
  sticky?: boolean;
  blur?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  leftNode,
  centerNode,
  rightNode,
  sticky = true,
  blur = true,
  className,
  ...props
}) => {
  return (
    <header
      className={cn(
        styles.topbar,
        sticky && styles.sticky,
        blur && styles.blur,
        className
      )}
      {...props}
    >
      <div className={styles.container}>
        {leftNode && <div className={styles.left}>{leftNode}</div>}
        {centerNode && <div className={styles.center}>{centerNode}</div>}
        {rightNode && <div className={styles.right}>{rightNode}</div>}
      </div>
    </header>
  );
};
