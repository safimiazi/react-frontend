import { useState, useEffect } from 'react';
import { useScene } from '../../hooks/useScene';

const OBJECT_OPTIONS = [
  { value: 'cube', label: 'Cube' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'custom1', label: 'Custom Object 1' },
  { value: 'custom2', label: 'Custom Object 2' },
];

export function AddObjectDialog({ isOpen, onClose }) {
  const { addObject } = useScene();
  const [selected, setSelected] = useState('cube');

  // Reset selection to 'cube' each time the dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelected('cube');
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleAdd = () => {
    addObject(selected);
    onClose();
  };

  const handleBackdropClick = (e) => {
    // Only close if the click was directly on the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 500,
        pointerEvents: 'auto',
      }}
    >
      <div
        style={{
          backgroundColor: '#1e1e2e',
          border: '1px solid #374151',
          borderRadius: '12px',
          padding: '24px',
          minWidth: '280px',
          color: '#f1f5f9',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
        }}
      >
        <h2
          style={{
            margin: '0 0 16px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#f8fafc',
          }}
        >
          Add Object
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
          {OBJECT_OPTIONS.map((option) => (
            <label
              key={option.value}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                color: selected === option.value ? '#60a5fa' : '#cbd5e1',
              }}
            >
              <input
                type="radio"
                name="objectType"
                value={option.value}
                checked={selected === option.value}
                onChange={() => setSelected(option.value)}
                style={{ cursor: 'pointer', accentColor: '#60a5fa' }}
              />
              {option.label}
            </label>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #374151',
              backgroundColor: 'transparent',
              color: '#94a3b8',
              fontSize: '14px',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
