import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils';
import { CaretDown } from '@phosphor-icons/react';
import styles from './Select.module.css';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      disabled,
      children,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;
    const helperId = `${selectId}-helper`;
    const errorId = `${selectId}-error`;
    const hasError = !!errorText;

    return (
      <div className={cn(styles.wrapper, disabled && styles.disabled, className)}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={cn(
            styles.selectContainer,
            hasError && styles.error,
            disabled && styles.disabledContainer
          )}
        >
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            aria-invalid={hasError}
            className={styles.select}
            {...props}
          >
            {children}
          </select>
          <div className={styles.iconContainer}>
            <CaretDown size={16} weight="bold" />
          </div>
        </div>
        {hasError && (
          <p id={errorId} className={styles.errorText} role="alert">
            {errorText}
          </p>
        )}
        {!hasError && helperText && (
          <p id={helperId} className={styles.helperText}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
