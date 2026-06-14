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

export interface CiamikProviderProps {
  /** Brand token overrides (Layer 3) */
  brand?: BrandTokens;
  /** Enable dark mode */
  darkMode?: boolean;
  /** Children to render */
  children: React.ReactNode;
  /** Additional className on wrapper */
  className?: string;
}
