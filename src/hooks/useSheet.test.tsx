import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSheet } from './useSheet';

describe('useSheet', () => {
  it('should initialize with default closed state', () => {
    const { result } = renderHook(() => useSheet());
    expect(result.current.isOpen).toBe(false);
  });

  it('should initialize with initialOpen state if passed', () => {
    const { result } = renderHook(() => useSheet(true));
    expect(result.current.isOpen).toBe(true);
  });

  it('should open, close, and toggle the sheet state correctly', () => {
    const { result } = renderHook(() => useSheet(false));

    // Open sheet
    act(() => {
      result.current.open();
    });
    expect(result.current.isOpen).toBe(true);

    // Close sheet
    act(() => {
      result.current.close();
    });
    expect(result.current.isOpen).toBe(false);

    // Toggle sheet (to true)
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(true);

    // Toggle sheet (to false)
    act(() => {
      result.current.toggle();
    });
    expect(result.current.isOpen).toBe(false);
  });
});
