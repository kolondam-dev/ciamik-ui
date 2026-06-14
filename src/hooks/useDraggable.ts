import { useState, useRef, useCallback } from 'react';

export interface DragState {
  isDragging: boolean;
  startX: number;
  startY: number;
  x: number;
  y: number;
  deltaX: number;
  deltaY: number;
}

/**
 * useDraggable — Pointer-event drag gesture hook.
 * Helps with custom dragging components (like Sheets, Kanban, range sliders).
 */
export function useDraggable(
  onDrag?: (state: DragState) => void,
  onDragEnd?: (state: DragState) => void
) {
  const [state, setState] = useState<DragState>({
    isDragging: false,
    startX: 0,
    startY: 0,
    x: 0,
    y: 0,
    deltaX: 0,
    deltaY: 0,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      const startX = e.clientX;
      const startY = e.clientY;

      const newState: DragState = {
        isDragging: true,
        startX,
        startY,
        x: startX,
        y: startY,
        deltaX: 0,
        deltaY: 0,
      };

      setState(newState);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const deltaY = moveEvent.clientY - startY;

        const updatedState: DragState = {
          isDragging: true,
          startX,
          startY,
          x: moveEvent.clientX,
          y: moveEvent.clientY,
          deltaX,
          deltaY,
        };

        setState(updatedState);
        if (onDrag) onDrag(updatedState);
      };

      const handlePointerUp = (upEvent: PointerEvent) => {
        const deltaX = upEvent.clientX - startX;
        const deltaY = upEvent.clientY - startY;

        const finalState: DragState = {
          isDragging: false,
          startX,
          startY,
          x: upEvent.clientX,
          y: upEvent.clientY,
          deltaX,
          deltaY,
        };

        setState(finalState);
        if (onDragEnd) onDragEnd(finalState);

        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [onDrag, onDragEnd]
  );

  return {
    ...state,
    handlePointerDown,
  };
}
