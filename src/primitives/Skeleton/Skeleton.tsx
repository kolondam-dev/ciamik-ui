import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import styles from './Skeleton.module.css';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circle' | 'rect' | 'card';
  width?: string | number;
  height?: string | number;
  animated?: boolean;
}

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, variant = 'rect', width, height, animated = true, style, ...props }, ref) => {
    const customStyle: React.CSSProperties = {
      ...style,
      width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
      height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
    };

    return (
      <div
        ref={ref}
        style={customStyle}
        className={cn(
          styles.skeleton,
          styles[variant],
          animated && styles.animated,
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
