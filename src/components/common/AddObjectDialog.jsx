import { useState, useEffect } from 'react';
import { useScene } from '../../hooks/useScene';
import { 
  Box, 
  Circle, 
  Rabbit, 
  Zap, 
  User, 
  X,
  Sparkles
} from 'lucide-react';

const OBJECT_OPTIONS = [
  { value: 'cube', label: 'Cube', icon: Box, color: '#f97316', desc: 'Perfect for basic shapes' },
  { value: 'sphere', label: 'Sphere', icon: Circle, color: '#fb923c', desc: 'Smooth and round' },
  { value: 'custom1', label: 'Duck (GLTF)', icon: Rabbit, color: '#f97316', desc: 'Cute 3D duck model' },
  { value: 'custom2', label: 'Torus (primitive)', icon: Zap, color: '#fb923c', desc: 'Ring-like shape' },
  { value: 'custom3', label: 'Human (GLTF)', icon: User, color: '#f97316', desc: 'Animated character' },
];

export function AddObjectDialog({ isOpen, onClose }) {
  const { addObject } = useScene();
  const [selected, setSelected] = useState('cube');
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const closingId = setTimeout(() => setIsClosing(false), 0);
      const selectedId = setTimeout(() => setSelected('cube'), 0);
      return () => {
        clearTimeout(closingId);
        clearTimeout(selectedId);
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200);
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleAdd = () => {
    addObject(selected);
    handleClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen && !isClosing) return null;


  return (
    <div
      onClick={handleBackdropClick}
      className={`fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[500] pointer-events-auto transition-all duration-200 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className={`bg-[#1e1e2e] rounded-lg border border-gray-700 shadow-xl overflow-hidden w-[400px] transition-all duration-200 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-100">
              Add Object
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded hover:bg-gray-700 transition-colors"
          >
            <X size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Object Options */}
        <div className="px-5 py-4">
          <div className="space-y-2">
            {OBJECT_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isSelected = selected === option.value;
              
              return (
                <label
                  key={option.value}
                  className={`
                    flex items-center gap-3 p-2.5 rounded-lg cursor-pointer
                    transition-all duration-150
                    ${isSelected 
                      ? 'bg-orange-500/10 border border-orange-500/30' 
                      : 'bg-gray-800/30 border border-gray-700 hover:bg-gray-800 hover:border-gray-600'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="objectType"
                    value={option.value}
                    checked={isSelected}
                    onChange={() => setSelected(option.value)}
                    className="w-3.5 h-3.5 cursor-pointer accent-orange-500 hidden"
                  />
                  
                  {/* Icon */}
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      background: isSelected ? `${option.color}15` : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isSelected ? option.color : 'rgba(255,255,255,0.1)'}`
                    }}
                  >
                    <Icon 
                      size={16} 
                      style={{ 
                        color: isSelected ? option.color : '#94a3b8'
                      }} 
                    />
                  </div>
                  
                  {/* Label */}
                  <div className="flex-1">
                    <div 
                      className="text-sm font-medium"
                      style={{ color: isSelected ? option.color : '#e2e8f0' }}
                    >
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {option.desc}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-5 py-4 border-t border-gray-700 flex gap-2 justify-end">
          <button
            onClick={handleClose}
            className="px-3 py-1.5 rounded-md border border-gray-600 bg-transparent text-gray-300 text-sm hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="px-3 py-1.5 rounded-md bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Add Object
          </button>
        </div>
      </div>
    </div>
  );
}