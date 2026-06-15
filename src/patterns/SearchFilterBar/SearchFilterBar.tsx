import React, { useEffect, useState } from 'react';
import { Input } from '../../primitives/Input';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { cn } from '../../utils';
import { useCiamik } from '../../provider';
import styles from './SearchFilterBar.module.css';

export interface FilterOption {
  key: string;
  label: string;
}

export interface SearchFilterBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  filterOptions?: FilterOption[];
  activeFilterKey?: string;
  onFilterKeyChange?: (key: string) => void;
  className?: string;
  debounceMs?: number;
  translations?: {
    searchPlaceholder?: string;
    clearSearchAria?: string;
  };
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchValue,
  onSearchChange,
  placeholder = 'Cari...',
  filterOptions = [],
  activeFilterKey,
  onFilterKeyChange,
  className,
  debounceMs = 300,
  translations,
}) => {
  const { labels } = useCiamik();
  const t = {
    searchPlaceholder: translations?.searchPlaceholder || labels?.searchFilterBar?.searchPlaceholder || 'Cari...',
    clearSearchAria: translations?.clearSearchAria || labels?.searchFilterBar?.clearSearchAria || 'Bersihkan pencarian',
  };

  const [localSearch, setLocalSearch] = useState(searchValue);

  // Sync state if prop changes from outside
  useEffect(() => {
    setLocalSearch(searchValue);
  }, [searchValue]);

  // Debounce handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchValue) {
        onSearchChange(localSearch);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange, debounceMs, searchValue]);

  const handleClear = () => {
    setLocalSearch('');
    onSearchChange('');
  };

  return (
    <div className={cn(styles.wrapper, className)}>
      <div className={styles.searchRow}>
        <Input
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder={placeholder !== 'Cari...' ? placeholder : t.searchPlaceholder}
          prefixNode={<MagnifyingGlass size={18} />}
          suffixNode={
            localSearch && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={handleClear}
                aria-label={t.clearSearchAria}
                data-testid="search-clear-btn"
              >
                <X size={14} weight="bold" />
              </button>
            )
          }
          className={styles.searchInput}
        />
      </div>

      {filterOptions.length > 0 && onFilterKeyChange && (
        <div className={styles.filterRow} role="tablist">
          {filterOptions.map((opt) => {
            const isActive = activeFilterKey === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onFilterKeyChange(opt.key)}
                className={cn(styles.filterChip, isActive && styles.activeChip)}
              >
                {opt.label}
                {isActive && (
                  <span className={styles.activeDot} data-testid="active-filter-dot" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
