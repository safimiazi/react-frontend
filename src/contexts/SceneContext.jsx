import { createContext, useState, useRef } from 'react';

export const SceneContext = createContext(null);

export function SceneProvider({ children }) {
  const [objects, setObjectsState] = useState([]);
  const [isDragging, setIsDraggingState] = useState(false);
  const [dragId, setDragId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToastState] = useState(null);
  const toastTimerRef = useRef(null);

  function addObject(type) {
    const instanceId = crypto.randomUUID();
    const x = Math.random() * 20 - 10;
    const z = Math.random() * 20 - 10;
    const y = 0;
    setObjectsState((prev) => [
      ...prev,
      { instanceId, type, position: { x, y, z }, scale: 1 },
    ]);
  }

  function updatePosition(instanceId, pos) {
    setObjectsState((prev) =>
      prev.map((obj) =>
        obj.instanceId === instanceId ? { ...obj, position: { ...pos } } : obj
      )
    );
  }

  function updateScale(instanceId, scale) {
    setObjectsState((prev) =>
      prev.map((obj) =>
        obj.instanceId === instanceId ? { ...obj, scale } : obj
      )
    );
  }

  function removeObject(instanceId) {
    setObjectsState((prev) => prev.filter((obj) => obj.instanceId !== instanceId));
    setSelectedId((prev) => (prev === instanceId ? null : prev));
  }

  function clearScene() {
    setObjectsState([]);
    setSelectedId(null);
  }

  function setObjects(objects) {
    // Ensure every loaded object has a scale field
    setObjectsState(objects.map((o) => ({ scale: 1, ...o })));
  }

  function setIsDragging(bool, id) {
    setIsDraggingState(bool);
    setDragId(id ?? null);
  }

  function setToast({ message, type }) {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToastState({ message, type });
    toastTimerRef.current = setTimeout(() => {
      setToastState(null);
      toastTimerRef.current = null;
    }, 3000);
  }

  return (
    <SceneContext.Provider
      value={{
        objects,
        isDragging,
        dragId,
        selectedId,
        setSelectedId,
        toast,
        addObject,
        updatePosition,
        updateScale,
        removeObject,
        clearScene,
        setObjects,
        setIsDragging,
        setToast,
      }}
    >
      {children}
    </SceneContext.Provider>
  );
}
