/**
 * CIAMIK Design System — Breakpoints (mobile-first)
 * Matches Tailwind-style naming. Used by useMediaQuery hook.
 */
export const BREAKPOINTS = {
  /** ~320px — HP kecil */
  base: 0,
  /** 360px — HP umum (Android mainstream) */
  xs: 360,
  /** 640px — HP besar / tablet portrait */
  sm: 640,
  /** 768px — Tablet */
  md: 768,
  /** 1024px — Desktop — sidebar muncul */
  lg: 1024,
  /** 1280px — Desktop lebar */
  xl: 1280,
  /** 1536px — Sangat lebar — konten di-cap */
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;
