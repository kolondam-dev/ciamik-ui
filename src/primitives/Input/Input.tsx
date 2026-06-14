import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
  prefixNode?: React.ReactNode;
  suffixNode?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      prefixNode,
      suffixNode,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;
    const helperId = `${inputId}-helper`;
    const errorId = `${inputId}-error`;
    const hasError = !!errorText;

    return (
      <div className={cn(styles.wrapper, disabled && styles.disabled, className)}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={cn(
            styles.inputContainer,
            hasError && styles.error,
            disabled && styles.disabledContainer
          )}
        >
          {prefixNode && <div className={styles.prefix}>{prefixNode}</div>}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            aria-invalid={hasError}
            className={cn(
              styles.input,
              prefixNode && styles.hasPrefix,
              suffixNode && styles.hasSuffix
            )}
            {...props}
          />
          {suffixNode && <div className={styles.suffix}>{suffixNode}</div>}
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

Input.displayName = 'Input';
