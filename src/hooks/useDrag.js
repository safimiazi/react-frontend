import { useScene } from './useScene';

export function useDrag() {
  const { isDragging, dragId, setIsDragging, updatePosition } = useScene();

  function onPointerDown(e, instanceId) {
    e.stopPropagation();
    setIsDragging(true, instanceId);
  }

  function onPointerMove(e) {
    if (!isDragging || !dragId) return;
    const { x, z } = e.point;
    const cx = Math.max(-10, Math.min(10, x));
    const cz = Math.max(-10, Math.min(10, z));
    updatePosition(dragId, { x: cx, y: 0, z: cz });
  }

  function onPointerUp() {
    setIsDragging(false, null);
  }

  return { onPointerDown, onPointerMove, onPointerUp };
}
