import { describe, it, expect } from 'vitest';
import { formatCurrency, formatCurrencyCompact, formatSoldCount } from './formatCurrency';

/**
 * Note: toLocaleString('id-ID') may produce non-breaking spaces (U+00A0 or U+202F)
 * instead of regular ASCII spaces. We normalize all whitespace before comparison.
 */
const normalize = (s: string) => s.replace(/\s/g, ' ');

describe('formatCurrency', () => {
  it('should format numbers with Rp prefix and dots as thousand separators', () => {
    expect(normalize(formatCurrency(450000))).toBe('Rp 450.000');
    expect(normalize(formatCurrency(1250000))).toBe('Rp 1.250.000');
    expect(normalize(formatCurrency(0))).toBe('Rp 0');
  });
});

describe('formatCurrencyCompact', () => {
  it('should format numbers >= 1B as M', () => {
    expect(formatCurrencyCompact(2500000000)).toBe('Rp 2.5M');
    expect(formatCurrencyCompact(1000000000)).toBe('Rp 1M');
  });

  it('should format numbers >= 1M as jt', () => {
    expect(formatCurrencyCompact(1500000)).toBe('Rp 1.5jt');
    expect(formatCurrencyCompact(3000000)).toBe('Rp 3jt');
  });

  it('should format numbers >= 1K as rb', () => {
    expect(formatCurrencyCompact(450000)).toBe('Rp 450rb');
    expect(formatCurrencyCompact(15000)).toBe('Rp 15rb');
  });

  it('should fall back to default format for < 1000', () => {
    expect(normalize(formatCurrencyCompact(350))).toBe('Rp 350');
  });
});

describe('formatSoldCount', () => {
  it('should format sold count correctly', () => {
    expect(formatSoldCount(1500)).toBe('1.5rb');
    expect(formatSoldCount(10000)).toBe('10rb');
    expect(formatSoldCount(340)).toBe('340');
  });
});
