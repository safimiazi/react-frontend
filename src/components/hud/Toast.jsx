import { useEffect } from 'react';
import { useScene } from '../../hooks/useScene';

export function Toast() {
  const { toast, setToast } = useScene();

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);
    return () => clearTimeout(timer);
  }, [toast, setToast]);

  if (!toast) return null;

  const isSuccess = toast.type === 'success';

  return (
    <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-md text-sm font-medium shadow-lg pointer-events-none z-[1000] whitespace-nowrap ${isSuccess ? 'bg-green-600' : 'bg-red-600'}`}>
      {toast.message}
    </div>
  );
}
