import React from 'react';
import { Button } from '../../primitives/Button';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import { cn } from '../../utils';
import { useCiamik } from '../../provider';
import styles from './Pagination.module.css';

export interface PaginationProps {
  strategy?: 'numbered' | 'load-more';
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onLoadMore?: () => void;
  isLoading?: boolean;
  hasMore?: boolean;
  className?: string;
  translations?: {
    prev?: string;
    next?: string;
    loadMore?: string;
    pageAria?: (page: number | string) => string;
  };
}

export const Pagination: React.FC<PaginationProps> = ({
  strategy = 'numbered',
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onLoadMore,
  isLoading = false,
  hasMore = false,
  className,
  translations,
}) => {
  const { labels } = useCiamik();
  const t = {
    prev: translations?.prev || labels?.pagination?.prev || 'Prev',
    next: translations?.next || labels?.pagination?.next || 'Next',
    loadMore: translations?.loadMore || labels?.pagination?.loadMore || 'Muat Lebih Banyak',
    pageAria: translations?.pageAria || labels?.pagination?.pageAria || ((p) => `Halaman ${p}`),
  };

  if (strategy === 'load-more') {
    if (!hasMore) return null;
    return (
      <div className={cn(styles.loadMoreWrapper, className)}>
        <Button
          variant="secondary"
          size="md"
          isLoading={isLoading}
          onClick={onLoadMore}
          className={styles.loadMoreBtn}
        >
          {t.loadMore}
        </Button>
      </div>
    );
  }

  // Generate page numbers
  const pages: (number | string)[] = [];
  const range = 2; // how many pages to show around current page

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - range && i <= currentPage + range)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== '...') {
      pages.push('...');
    }
  }

  const handlePageClick = (page: number | string) => {
    if (typeof page === 'number' && onPageChange && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) return null;

  return (
    <div className={cn(styles.numberedWrapper, className)} role="navigation" aria-label="Pagination">
      {/* Prev button */}
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange && onPageChange(currentPage - 1)}
        leftIcon={<CaretLeft size={14} weight="bold" />}
        aria-label={t.pageAria('sebelumnya')}
      >
        {t.prev}
      </Button>

      {/* Pages */}
      <div className={styles.pageNumbers}>
        {pages.map((p, index) => {
          const isCurrent = p === currentPage;
          const isEllipsis = p === '...';

          if (isEllipsis) {
            return (
              <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                {p}
              </span>
            );
          }

          return (
            <button
              key={`page-${p}`}
              type="button"
              onClick={() => handlePageClick(p)}
              className={cn(styles.pageBtn, isCurrent && styles.activePageBtn)}
              aria-current={isCurrent ? 'page' : undefined}
              aria-label={t.pageAria(p)}
            >
              {p}
            </button>
          );
        })}
      </div>

      {/* Next button */}
      <Button
        variant="secondary"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange && onPageChange(currentPage + 1)}
        rightIcon={<CaretRight size={14} weight="bold" />}
        aria-label={t.pageAria('berikutnya')}
      >
        {t.next}
      </Button>
    </div>
  );
};
