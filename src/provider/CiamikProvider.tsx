import React, { createContext, useContext, useMemo, useEffect } from 'react';
import type { BrandTokens, CiamikProviderProps, GlobalLabels } from './types';
import { ToastProvider } from '../primitives/Toast';

/** Map from BrandTokens property names to CSS custom property names */
const TOKEN_MAP: Record<keyof BrandTokens, string> = {
  primary:       '--ciamik-primary',
  primaryHover:  '--ciamik-primary-hover',
  accent:        '--ciamik-accent',
  accentPress:   '--ciamik-accent-press',
  highlight:     '--ciamik-highlight',
  ink:           '--ciamik-ink',
  textSecondary: '--ciamik-text-secondary',
  surface:       '--ciamik-surface',
  bg:            '--ciamik-bg',
  success:       '--ciamik-success',
  warning:       '--ciamik-warning',
  danger:        '--ciamik-danger',
  info:          '--ciamik-info',
  border:        '--ciamik-border',
  borderFaint:   '--ciamik-border-faint',
};

interface CiamikContextValue {
  darkMode: boolean;
  brand?: BrandTokens;
  labels?: GlobalLabels;
}

const CiamikContext = createContext<CiamikContextValue>({
  darkMode: false,
});

/**
 * CiamikProvider — Root provider for the CIAMIK Design System.
 *
 * Wraps your app to:
 * 1. Inject Brand tokens (Layer 3) as CSS custom properties
 * 2. Toggle dark mode via `.dark` class
 * 3. Provide context for design system hooks
 *
 * @example
 * ```tsx
 * <CiamikProvider brand={{ primary: '#E91E63' }} darkMode={false}>
 *   <App />
 * </CiamikProvider>
 * ```
 */
export function CiamikProvider({
  brand,
  labels,
  darkMode = false,
  children,
  className,
}: CiamikProviderProps) {
  const style = useMemo(() => {
    if (!brand) return undefined;

    const vars: Record<string, string> = {};
    for (const [key, cssVar] of Object.entries(TOKEN_MAP)) {
      const value = brand[key as keyof BrandTokens];
      if (value) {
        vars[cssVar] = value;
      }
    }

    return Object.keys(vars).length > 0 ? vars : undefined;
  }, [brand]);

  const contextValue = useMemo(
    () => ({ darkMode, brand, labels }),
    [darkMode, brand, labels]
  );

  useEffect(() => {
    if (darkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [darkMode]);

  const wrapperClass = className ?? undefined;

  return (
    <CiamikContext.Provider value={contextValue}>
      <div
        className={wrapperClass}
        style={style as React.CSSProperties}
        data-ciamik-root=""
      >
        <ToastProvider>{children}</ToastProvider>
      </div>
    </CiamikContext.Provider>
  );
}

/**
 * Hook to access CiamikProvider context.
 */
export function useCiamik() {
  return useContext(CiamikContext);
}
