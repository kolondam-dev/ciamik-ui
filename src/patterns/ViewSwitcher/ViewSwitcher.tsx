import React from 'react';
import { Table, List, SquaresFour, Columns } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './ViewSwitcher.module.css';

export type ViewType = 'table' | 'list' | 'grid' | 'kanban';

export interface ViewOption {
  key: ViewType | string;
  label: string;
  icon?: React.ReactNode;
}

export interface ViewSwitcherProps {
  activeView: string;
  onChange: (view: string) => void;
  options?: ViewOption[];
  className?: string;
}

const DEFAULT_ICONS: Record<ViewType, React.ReactNode> = {
  table: <Table size={16} weight="bold" />,
  list: <List size={16} weight="bold" />,
  grid: <SquaresFour size={16} weight="bold" />,
  kanban: <Columns size={16} weight="bold" />,
};

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({
  activeView,
  onChange,
  options = [
    { key: 'table', label: 'Tabel' },
    { key: 'grid', label: 'Grid' },
    { key: 'kanban', label: 'Kanban' },
  ],
  className,
}) => {
  return (
    <div className={cn(styles.switcherContainer, className)} role="tablist">
      {options.map((opt) => {
        const isActive = activeView === opt.key;
        const icon = opt.icon || DEFAULT_ICONS[opt.key as ViewType];

        return (
          <button
            key={opt.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(opt.key)}
            className={cn(styles.viewBtn, isActive && styles.activeBtn)}
          >
            {icon && <span className={styles.icon}>{icon}</span>}
            <span className={styles.label}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
