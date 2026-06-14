import { useMediaQuery } from './useMediaQuery';

/**
 * useReducedMotion — React hook to determine if user prefers reduced motion.
 *
 * @returns boolean
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
