import { clsx, type ClassValue } from 'clsx';

/**
 * Merge class names. Wrapper around clsx for consistency.
 *
 * @example
 * cn('base', isActive && 'active', className)
 */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
