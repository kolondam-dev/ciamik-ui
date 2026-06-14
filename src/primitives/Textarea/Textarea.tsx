import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils';
import styles from './Textarea.module.css';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  errorText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      errorText,
      disabled,
      id,
      rows = 4,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;
    const helperId = `${textareaId}-helper`;
    const errorId = `${textareaId}-error`;
    const hasError = !!errorText;

    return (
      <div className={cn(styles.wrapper, disabled && styles.disabled, className)}>
        {label && (
          <label htmlFor={textareaId} className={styles.label}>
            {label}
          </label>
        )}
        <div
          className={cn(
            styles.textareaContainer,
            hasError && styles.error,
            disabled && styles.disabledContainer
          )}
        >
          <textarea
            ref={ref}
            id={textareaId}
            disabled={disabled}
            rows={rows}
            aria-describedby={
              hasError ? errorId : helperText ? helperId : undefined
            }
            aria-invalid={hasError}
            className={styles.textarea}
            {...props}
          />
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

Textarea.displayName = 'Textarea';
