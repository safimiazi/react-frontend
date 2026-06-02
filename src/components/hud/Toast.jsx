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
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: isSuccess ? '#16a34a' : '#dc2626',
        color: '#ffffff',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        pointerEvents: 'none',
        zIndex: 1000,
        whiteSpace: 'nowrap',
      }}
    >
      {toast.message}
    </div>
  );
}
