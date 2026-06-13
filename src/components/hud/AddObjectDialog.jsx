import { useState, useEffect } from 'react';
import { useScene } from '../../hooks/useScene';

const OBJECT_OPTIONS = [
  { value: 'cube', label: 'Cube' },
  { value: 'sphere', label: 'Sphere' },
  { value: 'custom1', label: 'Duck (GLTF)' },
  { value: 'custom2', label: 'Fox (GLTF)' },
];

export function AddObjectDialog({ isOpen, onClose }) {
  const { addObject } = useScene();
  const [selected, setSelected] = useState('cube');

  useEffect(() => {
    if (isOpen) {
      const id = setTimeout(() => setSelected('cube'), 0);
      return () => clearTimeout(id);
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

    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="absolute top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[500] pointer-events-auto"
    >
      <div
        className="bg-[#1e1e2e] border border-[#374151] rounded-xl p-6 min-w-[280px] text-[#f1f5f9] shadow-2xl"
      >
        <h2
          className="m-0 mb-4 text-lg font-semibold text-[#f8fafc]"
        >
          Add Object
        </h2>

        <div className="flex flex-col gap-3 mb-6">
          {OBJECT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex items-center gap-2.5 cursor-pointer text-sm ${
                selected === option.value ? 'text-[#60a5fa]' : 'text-[#cbd5e1]'
              }`}
            >
              <input
                type="radio"
                name="objectType"
                value={option.value}
                checked={selected === option.value}
                onChange={() => setSelected(option.value)}
                className="cursor-pointer accent-[#60a5fa]"
              />
              {option.label}
            </label>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-[#374151] bg-transparent text-[#94a3b8] text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-4 py-2 rounded-md border-none bg-[#3b82f6] text-white text-sm font-medium cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}