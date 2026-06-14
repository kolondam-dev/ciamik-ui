import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDraggable } from './useDraggable';

describe('useDraggable', () => {
  it('should initialize with default states', () => {
    const { result } = renderHook(() => useDraggable());
    expect(result.current.isDragging).toBe(false);
    expect(result.current.deltaX).toBe(0);
    expect(result.current.deltaY).toBe(0);
  });

  it('should handle dragging flow correctly', () => {
    const onDrag = vi.fn();
    const onDragEnd = vi.fn();

    const { result } = renderHook(() => useDraggable(onDrag, onDragEnd));

    // Simulate pointer down
    const mockEvent = {
      clientX: 100,
      clientY: 100,
    } as unknown as React.PointerEvent;

    act(() => {
      result.current.handlePointerDown(mockEvent);
    });

    expect(result.current.isDragging).toBe(true);
    expect(result.current.startX).toBe(100);
    expect(result.current.startY).toBe(100);

    // Simulate pointer move
    const moveEvent = new PointerEvent('pointermove', { clientX: 150, clientY: 120 });
    act(() => {
      window.dispatchEvent(moveEvent);
    });

    expect(result.current.deltaX).toBe(50);
    expect(result.current.deltaY).toBe(20);
    expect(onDrag).toHaveBeenCalledWith(
      expect.objectContaining({
        deltaX: 50,
        deltaY: 20,
        isDragging: true,
      })
    );

    // Simulate pointer up
    const upEvent = new PointerEvent('pointerup', { clientX: 160, clientY: 130 });
    act(() => {
      window.dispatchEvent(upEvent);
    });

    expect(result.current.isDragging).toBe(false);
    expect(result.current.deltaX).toBe(60);
    expect(result.current.deltaY).toBe(30);
    expect(onDragEnd).toHaveBeenCalledWith(
      expect.objectContaining({
        deltaX: 60,
        deltaY: 30,
        isDragging: false,
      })
    );
  });
});
