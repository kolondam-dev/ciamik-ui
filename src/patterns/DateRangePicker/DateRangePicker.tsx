import React, { useState, useRef, useEffect } from 'react';
import { Calendar, CaretDown } from '@phosphor-icons/react';
import { cn } from '../../utils';
import styles from './DateRangePicker.module.css';

export interface DateRangePreset {
  key: string;
  label: string;
  getDates: () => { start: Date; end: Date };
}

export interface DateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onChange: (start: Date | null, end: Date | null, presetKey?: string) => void;
  presets?: DateRangePreset[];
  compare?: boolean;
  onCompareChange?: (compare: boolean) => void;
  className?: string;
}

const formatDateString = (date: Date | null): string => {
  if (!date) return '-';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const toInputFormat = (date: Date | null): string => {
  if (!date) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const fromInputFormat = (val: string): Date | null => {
  if (!val) return null;
  return new Date(val);
};

export const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    key: 'today',
    label: 'Hari Ini',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      return { start, end };
    },
  },
  {
    key: 'yesterday',
    label: 'Kemarin',
    getDates: () => {
      const end = new Date();
      end.setDate(end.getDate() - 1);
      const start = new Date();
      start.setDate(start.getDate() - 1);
      return { start, end };
    },
  },
  {
    key: 'last-7-days',
    label: '7 Hari Terakhir',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 6);
      return { start, end };
    },
  },
  {
    key: 'last-30-days',
    label: '30 Hari Terakhir',
    getDates: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 29);
      return { start, end };
    },
  },
];

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  presets = DEFAULT_PRESETS,
  compare = false,
  onCompareChange,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<string>('last-7-days');
  const [isCustom, setIsCustom] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handlePresetClick = (preset: DateRangePreset) => {
    setActivePreset(preset.key);
    setIsCustom(false);
    const { start, end } = preset.getDates();
    onChange(start, end, preset.key);
    setIsOpen(false);
  };

  const handleCustomSelect = () => {
    setIsCustom(true);
    setActivePreset('custom');
  };

  const handleCustomDateChange = (type: 'start' | 'end', val: string) => {
    const d = fromInputFormat(val);
    if (type === 'start') {
      onChange(d, endDate, 'custom');
    } else {
      onChange(startDate, d, 'custom');
    }
  };

  // Get active range label
  const getLabel = () => {
    if (isCustom) {
      return `Kustom (${formatDateString(startDate)} - ${formatDateString(endDate)})`;
    }
    const currentPreset = presets.find((p) => p.key === activePreset);
    if (currentPreset) {
      return `${currentPreset.label} (${formatDateString(startDate)} - ${formatDateString(endDate)})`;
    }
    return `${formatDateString(startDate)} - ${formatDateString(endDate)}`;
  };

  return (
    <div className={cn(styles.wrapper, className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className={styles.triggerBtn}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        data-testid="datepicker-trigger-btn"
      >
        <Calendar size={18} className={styles.calIcon} />
        <span className={styles.label}>{getLabel()}</span>
        <CaretDown size={14} className={styles.caret} />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className={styles.dropdown} data-testid="datepicker-dropdown">
          <div className={styles.presetsList}>
            {presets.map((preset) => {
              const isActive = activePreset === preset.key;
              return (
                <button
                  key={preset.key}
                  type="button"
                  onClick={() => handlePresetClick(preset)}
                  className={cn(styles.presetItem, isActive && styles.activeItem)}
                >
                  {preset.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={handleCustomSelect}
              className={cn(styles.presetItem, isCustom && styles.activeItem)}
            >
              Kustom
            </button>
          </div>

          {/* Custom Date Selection (Native inputs for mobile support) */}
          {isCustom && (
            <div className={styles.customSection} data-testid="custom-inputs">
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Mulai</label>
                <input
                  type="date"
                  value={toInputFormat(startDate)}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Selesai</label>
                <input
                  type="date"
                  value={toInputFormat(endDate)}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  className={styles.dateInput}
                />
              </div>
            </div>
          )}

          {/* Compare Row */}
          {onCompareChange && (
            <div className={styles.compareRow}>
              <label className={styles.compareLabel}>
                <input
                  type="checkbox"
                  checked={compare}
                  onChange={(e) => onCompareChange(e.target.checked)}
                  className={styles.compareCheckbox}
                />
                <span>Bandingkan dengan periode sebelumnya</span>
              </label>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
