import React from 'react';
import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToast } from './useToast';
import { ToastProvider } from '../primitives/Toast/ToastContext';

describe('useToast', () => {
  it('should throw error when used outside ToastProvider', () => {
    // Suppress console.error momentarily to avoid noisy output for expected throw
    const originalError = console.error;
    console.error = () => {};

    expect(() => {
      renderHook(() => useToast());
    }).toThrow('useToastContext must be used within a ToastProvider');

    console.error = originalError;
  });

  it('should call toast triggers when wrapped with ToastProvider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ToastProvider>{children}</ToastProvider>
    );

    const { result } = renderHook(() => useToast(), { wrapper });

    expect(typeof result.current.toast).toBe('function');

    act(() => {
      result.current.toast('Test message', 'success');
    });
  });
});
