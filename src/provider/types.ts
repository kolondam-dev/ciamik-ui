/**
 * CIAMIK Design System — Brand Token Types (Layer 3)
 * Override-able tokens per merchant via CiamikProvider.
 */
export interface BrandTokens {
  /** Primary brand color — dominan: tombol utama, link, brand */
  primary?: string;
  /** Primary hover state */
  primaryHover?: string;
  /** Accent color — CTA "Beli", promo, urgency */
  accent?: string;
  /** Accent pressed state */
  accentPress?: string;
  /** Highlight color — rating, badge spesial */
  highlight?: string;
  /** Main text color */
  ink?: string;
  /** Secondary text color */
  textSecondary?: string;
  /** Surface/card background */
  surface?: string;
  /** Page background */
  bg?: string;
  /** Success state color */
  success?: string;
  /** Warning state color */
  warning?: string;
  /** Danger/error state color */
  danger?: string;
  /** Info state color */
  info?: string;
  /** Border color */
  border?: string;
  /** Faint border color */
  borderFaint?: string;
}

export interface GlobalLabels {
  emptyState?: {
    noDataTitle?: string;
    noDataDesc?: string;
    noResultsTitle?: string;
    noResultsDesc?: string;
    noPermissionTitle?: string;
    noPermissionDesc?: string;
    noConnectionTitle?: string;
    noConnectionDesc?: string;
  };
  pagination?: {
    prev?: string;
    next?: string;
    loadMore?: string;
    pageAria?: (page: number | string) => string;
  };
  otpFlow?: {
    step1Title?: string;
    step1Desc?: string;
    step1Cta?: string;
    step1Placeholder?: string;
    step2Title?: string;
    step2Desc?: (phone: string) => string | React.ReactNode;
    step2Cta?: string;
    step2ResendText?: (timer: number) => string;
    step2ResendCta?: string;
    step3Title?: string;
    step3Desc?: string;
    errorInvalidPhone?: string;
    errorSendFail?: string;
    errorConnection?: string;
    errorIncomplete?: string;
    errorVerifyFail?: string;
    errorResendFail?: string;
    cancel?: string;
  };
  dateRangePicker?: {
    today?: string;
    yesterday?: string;
    last7Days?: string;
    last30Days?: string;
    custom?: string;
    startDate?: string;
    endDate?: string;
    compare?: string;
  };
  dataTable?: {
    emptyTitle?: string;
    emptyDesc?: string;
    loading?: string;
    selectedRows?: (count: number) => string;
    actionsColumn?: string;
  };
  systemAlert?: {
    close?: string;
  };
  searchFilterBar?: {
    searchPlaceholder?: string;
    clearSearchAria?: string;
  };
  statusBadge?: Record<string, string>;
  modal?: {
    close?: string;
    confirm?: string;
    cancel?: string;
  };
  sheet?: {
    close?: string;
  };
}

export interface CiamikProviderProps {
  /** Brand token overrides (Layer 3) */
  brand?: BrandTokens;
  /** Global i18n labels configuration */
  labels?: GlobalLabels;
  /** Enable dark mode */
  darkMode?: boolean;
  /** Children to render */
  children: React.ReactNode;
  /** Additional className on wrapper */
  className?: string;
}
