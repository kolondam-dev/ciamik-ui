/**
 * Format number as Indonesian Rupiah.
 *
 * @example
 * formatCurrency(450000)  // "Rp 450.000"
 * formatCurrency(1200000) // "Rp 1.200.000"
 */
export function formatCurrency(value: number): string {
  return 'Rp ' + value.toLocaleString('id-ID');
}

/**
 * Format number as compact Indonesian Rupiah.
 *
 * @example
 * formatCurrencyCompact(1200000) // "Rp 1,2jt"
 * formatCurrencyCompact(450000)  // "Rp 450rb"
 */
export function formatCurrencyCompact(value: number): string {
  if (value >= 1_000_000_000) {
    return `Rp ${(value / 1_000_000_000).toFixed(1).replace('.0', '')}M`;
  }
  if (value >= 1_000_000) {
    return `Rp ${(value / 1_000_000).toFixed(1).replace('.0', '')}jt`;
  }
  if (value >= 1_000) {
    return `Rp ${(value / 1_000).toFixed(0)}rb`;
  }
  return formatCurrency(value);
}

/**
 * Format sales count in compact form.
 *
 * @example
 * formatSoldCount(1500) // "1,5rb"
 * formatSoldCount(340)  // "340"
 */
export function formatSoldCount(sold: number): string {
  if (sold >= 1000) {
    return (sold / 1000).toFixed(1).replace('.0', '') + 'rb';
  }
  return String(sold);
}
