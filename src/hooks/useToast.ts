import { useToastContext } from '../primitives/Toast/ToastContext';

/**
 * useToast — Custom hook to trigger float notifications.
 * Must be used within ToastProvider (or CiamikProvider).
 *
 * @example
 * ```tsx
 * const { toast } = useToast();
 * toast('Data berhasil disimpan!', 'success');
 * ```
 */
export function useToast() {
  return useToastContext();
}
