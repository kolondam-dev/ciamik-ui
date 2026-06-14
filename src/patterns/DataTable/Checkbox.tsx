import React, { forwardRef, useEffect, useRef } from 'react';
import { cn } from '../../utils';
import styles from './Checkbox.module.css';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, indeterminate = false, onChange, ...props }, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const resolvedRef = (ref || localRef) as React.RefObject<HTMLInputElement>;

    useEffect(() => {
      if (resolvedRef.current) {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <label className={cn(styles.container, className)}>
        <input
          type="checkbox"
          ref={resolvedRef}
          checked={checked}
          onChange={onChange}
          className={styles.input}
          {...props}
        />
        <span
          className={cn(
            styles.checkmark,
            checked && styles.checked,
            indeterminate && styles.indeterminate
          )}
        />
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';
