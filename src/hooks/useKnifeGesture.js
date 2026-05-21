import { useRef, useState, useCallback } from 'react';

export function useKnifeGesture({ onSlice, threshold = 180 }) {
  const startY = useRef(null);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [sliced, setSliced] = useState(false);

  const handleStart = useCallback((e) => {
    if (sliced) return;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    startY.current = clientY;
    setIsDragging(true);
  }, [sliced]);

  const handleMove = useCallback((e) => {
    if (!isDragging || sliced || startY.current === null) return;
    e.preventDefault();
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const delta = Math.max(0, clientY - startY.current);
    setDragY(Math.min(delta, threshold + 40));

    if (delta >= threshold) {
      setSliced(true);
      setIsDragging(false);
      onSlice?.();
    }
  }, [isDragging, sliced, threshold, onSlice]);

  const handleEnd = useCallback(() => {
    if (sliced) return;
    setIsDragging(false);
    setDragY(0);
    startY.current = null;
  }, [sliced]);

  return {
    dragY,
    isDragging,
    sliced,
    handlers: {
      onMouseDown: handleStart,
      onMouseMove: handleMove,
      onMouseUp: handleEnd,
      onMouseLeave: handleEnd,
      onTouchStart: handleStart,
      onTouchMove: handleMove,
      onTouchEnd: handleEnd,
    },
  };
}
