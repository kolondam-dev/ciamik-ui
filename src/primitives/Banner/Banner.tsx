import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils';
import { CheckCircle, Warning, XCircle, Info, X } from '@phosphor-icons/react';
import styles from './Banner.module.css';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'success' | 'warning' | 'danger' | 'info';
  title?: string;
  isClosable?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const DEFAULT_ICONS = {
  success: <CheckCircle size={20} weight="fill" />,
  warning: <Warning size={20} weight="fill" />,
  danger: <XCircle size={20} weight="fill" />,
  info: <Info size={20} weight="fill" />,
};

export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant = 'info',
      title,
      isClosable = false,
      onClose,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(true);

    const handleClose = () => {
      setIsVisible(false);
      if (onClose) onClose();
    };

    if (!isVisible) return null;

    const finalIcon = icon || DEFAULT_ICONS[variant];

    return (
      <div
        ref={ref}
        className={cn(styles.banner, styles[variant], className)}
        role="alert"
        {...props}
      >
        <div className={styles.iconWrapper}>{finalIcon}</div>
        <div className={styles.content}>
          {title && <h4 className={styles.title}>{title}</h4>}
          <div className={styles.body}>{children}</div>
        </div>
        {isClosable && (
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Tutup"
          >
            <X size={16} weight="bold" />
          </button>
        )}
      </div>
    );
  }
);

Banner.displayName = 'Banner';
