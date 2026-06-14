import React, { forwardRef } from 'react';
import { cn } from '../../utils';
import { Package, MagnifyingGlass, Lock, WifiSlash } from '@phosphor-icons/react';
import { Button } from '../Button';
import styles from './EmptyState.module.css';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'no-data' | 'no-results' | 'no-permission' | 'no-connection';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

const DEFAULT_ICONS = {
  'no-data': <Package size={48} weight="light" />,
  'no-results': <MagnifyingGlass size={48} weight="light" />,
  'no-permission': <Lock size={48} weight="light" />,
  'no-connection': <WifiSlash size={48} weight="light" />,
};

const DEFAULT_TITLES = {
  'no-data': 'Belum Ada Data',
  'no-results': 'Hasil Tidak Ditemukan',
  'no-permission': 'Akses Dibatasi',
  'no-connection': 'Koneksi Terputus',
};

const DEFAULT_DESCRIPTIONS = {
  'no-data': 'Data yang Anda cari saat ini belum tersedia atau belum ditambahkan.',
  'no-results': 'Coba cari dengan kata kunci lain atau periksa filter pencarian Anda.',
  'no-permission': 'Anda tidak memiliki hak akses yang cukup untuk melihat halaman ini.',
  'no-connection': 'Periksa sambungan internet Anda dan coba muat ulang halaman ini.',
};

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      variant = 'no-data',
      title,
      description,
      icon,
      actionLabel,
      onAction,
      ...props
    },
    ref
  ) => {
    const finalIcon = icon || DEFAULT_ICONS[variant];
    const finalTitle = title || DEFAULT_TITLES[variant];
    const finalDescription = description || DEFAULT_DESCRIPTIONS[variant];

    return (
      <div ref={ref} className={cn(styles.container, className)} {...props}>
        <div className={styles.iconWrapper}>{finalIcon}</div>
        <h3 className={styles.title}>{finalTitle}</h3>
        <p className={styles.description}>{finalDescription}</p>
        {actionLabel && onAction && (
          <Button variant="primary" size="md" onClick={onAction} className={styles.actionBtn}>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
