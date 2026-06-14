/**
 * CIAMIK Design System — Status System (CMP-014)
 * Maps 15 Order Lifecycle statuses → visual attributes.
 * Source of truth for StatusBadge component.
 */

export type StatusIntent = 'neutral' | 'success' | 'warning' | 'danger';

export interface StatusConfig {
  label: string;
  intent: StatusIntent;
  /** Phosphor icon name (PascalCase, e.g. 'Clock') */
  icon: string;
  /** Tabler fallback icon class (e.g. 'ti-clock') */
  iconFallback: string;
  /** True if this is a terminal/final status */
  isFinal: boolean;
  category: 'order' | 'return';
}

export const STATUS_MAP: Record<string, StatusConfig> = {
  PENDING_PAYMENT: {
    label: 'Menunggu bayar',
    intent: 'warning',
    icon: 'Clock',
    iconFallback: 'ti-clock',
    isFinal: false,
    category: 'order',
  },
  PAID: {
    label: 'Dibayar',
    intent: 'neutral',
    icon: 'Money',
    iconFallback: 'ti-cash',
    isFinal: false,
    category: 'order',
  },
  PROCESSING: {
    label: 'Diproses',
    intent: 'neutral',
    icon: 'Gear',
    iconFallback: 'ti-settings',
    isFinal: false,
    category: 'order',
  },
  PACKED: {
    label: 'Dikemas',
    intent: 'neutral',
    icon: 'Package',
    iconFallback: 'ti-package',
    isFinal: false,
    category: 'order',
  },
  SHIPPED: {
    label: 'Dikirim',
    intent: 'neutral',
    icon: 'Truck',
    iconFallback: 'ti-truck-delivery',
    isFinal: false,
    category: 'order',
  },
  DELIVERED: {
    label: 'Sampai',
    intent: 'neutral',
    icon: 'MapPin',
    iconFallback: 'ti-map-pin-check',
    isFinal: false,
    category: 'order',
  },
  COMPLETED: {
    label: 'Selesai',
    intent: 'success',
    icon: 'CheckCircle',
    iconFallback: 'ti-circle-check',
    isFinal: true,
    category: 'order',
  },
  CANCELLED: {
    label: 'Dibatalkan',
    intent: 'danger',
    icon: 'Prohibit',
    iconFallback: 'ti-ban',
    isFinal: true,
    category: 'order',
  },
  RETURN_REQUESTED: {
    label: 'Retur diajukan',
    intent: 'warning',
    icon: 'ArrowBendUpLeft',
    iconFallback: 'ti-arrow-back-up',
    isFinal: false,
    category: 'return',
  },
  DISPUTED: {
    label: 'Sengketa',
    intent: 'warning',
    icon: 'Gavel',
    iconFallback: 'ti-gavel',
    isFinal: false,
    category: 'return',
  },
  RETURN_IN_TRANSIT: {
    label: 'Retur dikirim',
    intent: 'neutral',
    icon: 'Truck',
    iconFallback: 'ti-truck-return',
    isFinal: false,
    category: 'return',
  },
  RETURN_RECEIVED: {
    label: 'Retur diterima',
    intent: 'neutral',
    icon: 'Package',
    iconFallback: 'ti-package-import',
    isFinal: false,
    category: 'return',
  },
  RETURN_REJECTED: {
    label: 'Retur ditolak',
    intent: 'danger',
    icon: 'X',
    iconFallback: 'ti-x',
    isFinal: true,
    category: 'return',
  },
  REFUNDED: {
    label: 'Dana dikembalikan',
    intent: 'neutral',
    icon: 'CurrencyDollar',
    iconFallback: 'ti-cash-banknote',
    isFinal: true,
    category: 'return',
  },
  EXCHANGED: {
    label: 'Ditukar',
    intent: 'neutral',
    icon: 'ArrowsLeftRight',
    iconFallback: 'ti-arrows-exchange',
    isFinal: true,
    category: 'return',
  },
} as const;

/** Get all statuses as a typed array */
export const ALL_STATUSES = Object.keys(STATUS_MAP) as (keyof typeof STATUS_MAP)[];

/** Get order statuses only */
export const ORDER_STATUSES = ALL_STATUSES.filter(
  (s) => STATUS_MAP[s].category === 'order'
);

/** Get return statuses only */
export const RETURN_STATUSES = ALL_STATUSES.filter(
  (s) => STATUS_MAP[s].category === 'return'
);
