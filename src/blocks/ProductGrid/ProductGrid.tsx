import React from 'react';
import { CaretRight } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './ProductGrid.module.css';

export interface ProductGridProps {
  title?: string;
  badge?: React.ReactNode;
  seeAllHref?: string;
  seeAllLabel?: string;
  onSeeAllClick?: () => void;
  children: React.ReactNode;
  className?: string;
  gridClassName?: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  badge,
  seeAllHref,
  seeAllLabel = 'Lihat semua',
  onSeeAllClick,
  children,
  className,
  gridClassName,
}) => {
  const showHeader = title || badge || seeAllHref || onSeeAllClick;

  const handleSeeAllClick = (e: React.MouseEvent) => {
    if (onSeeAllClick) {
      e.preventDefault();
      onSeeAllClick();
    }
  };

  return (
    <section className={cn(styles.section, className)}>
      {showHeader && (
        <div className={styles.secHeader}>
          <div className={styles.headerLeft}>
            {title && <h3>{title}</h3>}
            {badge && <div className={styles.badgeWrapper}>{badge}</div>}
          </div>
          {(seeAllHref || onSeeAllClick) && (
            <a
              href={seeAllHref || '#'}
              className={styles.seeAll}
              onClick={handleSeeAllClick}
            >
              {seeAllLabel} <CaretRight size={13} weight="bold" />
            </a>
          )}
        </div>
      )}
      <div className={cn(styles.grid, gridClassName)}>
        {children}
      </div>
    </section>
  );
};

ProductGrid.displayName = 'ProductGrid';
