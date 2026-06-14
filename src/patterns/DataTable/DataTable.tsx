import React from 'react';
import { cn } from '../../utils';
import { ArrowUp, ArrowDown, ArrowsDownUp } from '@phosphor-icons/react';
import { Checkbox } from './Checkbox'; // We will build a small inline checkbox or use basic input checkbox
import styles from './DataTable.module.css';

export interface DataTableColumn<T> {
  key: string;
  label: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectKeysChange?: (keys: (string | number)[]) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  bulkActions?: React.ReactNode;
  loading?: boolean;
  emptyState?: React.ReactNode;
  rowActions?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  selectable = false,
  selectedKeys = [],
  onSelectKeysChange,
  sortKey,
  sortDirection,
  onSortChange,
  bulkActions,
  loading = false,
  emptyState,
  rowActions,
}: DataTableProps<T>) {
  const allRowKeys = data.map(keyExtractor);
  const isAllSelected = data.length > 0 && allRowKeys.every((k) => selectedKeys.includes(k));
  const isSomeSelected = data.length > 0 && selectedKeys.length > 0 && !isAllSelected;

  const handleSelectAllToggle = () => {
    if (!onSelectKeysChange) return;
    if (isAllSelected) {
      // Unselect all
      onSelectKeysChange(selectedKeys.filter((k) => !allRowKeys.includes(k)));
    } else {
      // Select all in current page
      const nextKeys = Array.from(new Set([...selectedKeys, ...allRowKeys]));
      onSelectKeysChange(nextKeys);
    }
  };

  const handleSelectRowToggle = (key: string | number) => {
    if (!onSelectKeysChange) return;
    if (selectedKeys.includes(key)) {
      onSelectKeysChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectKeysChange([...selectedKeys, key]);
    }
  };

  const handleHeaderClick = (column: DataTableColumn<T>) => {
    if (!column.sortable || !onSortChange) return;

    if (sortKey === column.key) {
      // Toggle direction
      onSortChange(column.key, sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set to asc
      onSortChange(column.key, 'asc');
    }
  };

  return (
    <div className={styles.container}>
      {/* Bulk Actions Bar */}
      {selectable && selectedKeys.length > 0 && bulkActions && (
        <div className={styles.bulkActionsBar} data-testid="bulk-actions-bar">
          <span className={styles.selectedCount}>
            {selectedKeys.length} baris terpilih
          </span>
          <div className={styles.bulkActions}>{bulkActions}</div>
        </div>
      )}

      {/* Table Wrapper */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {selectable && (
                <th className={cn(styles.th, styles.checkboxCol)}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onChange={handleSelectAllToggle}
                    aria-label="Pilih semua baris"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass = styles[col.align || 'left'];

                return (
                  <th
                    key={col.key}
                    className={cn(
                      styles.th,
                      alignClass,
                      col.sortable && styles.sortableHeader
                    )}
                    onClick={() => handleHeaderClick(col)}
                    style={{ cursor: col.sortable ? 'pointer' : 'default' }}
                  >
                    <div className={styles.headerContent}>
                      <span>{col.label}</span>
                      {col.sortable && (
                        <span className={styles.sortIcon} data-testid={`sort-icon-${col.key}`}>
                          {isSorted ? (
                            sortDirection === 'asc' ? (
                              <ArrowUp size={12} weight="bold" />
                            ) : (
                              <ArrowDown size={12} weight="bold" />
                            )
                          ) : (
                            <ArrowsDownUp size={12} />
                          )}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
              {rowActions && <th className={cn(styles.th, styles.actionsCol)}>Aksi</th>}
            </tr>
          </thead>

          <tbody className={styles.tbody}>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className={styles.loadingCell}>
                  <div className={styles.loadingWrapper}>
                    <div className={styles.spinner} />
                    <span>Memuat data...</span>
                  </div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)} className={styles.emptyCell}>
                  {emptyState || (
                    <div className={styles.emptyStateDefault}>Data tidak tersedia.</div>
                  )}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => {
                const key = keyExtractor(row);
                const isSelected = selectedKeys.includes(key);

                return (
                  <tr
                    key={key}
                    className={cn(styles.tr, isSelected && styles.selectedRow)}
                  >
                    {selectable && (
                      <td className={cn(styles.td, styles.checkboxCol)}>
                        <Checkbox
                          checked={isSelected}
                          onChange={() => handleSelectRowToggle(key)}
                          aria-label={`Pilih baris ${idx + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const alignClass = styles[col.align || 'left'];
                      return (
                        <td key={col.key} className={cn(styles.td, alignClass)}>
                          {col.render ? col.render(row, idx) : (row as any)[col.key]}
                        </td>
                      );
                    })}
                    {rowActions && (
                      <td className={cn(styles.td, styles.actionsCol)}>
                        <div className={styles.rowActionsWrapper}>{rowActions(row)}</div>
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
