import { useState } from 'react';
import { AddObjectDialog } from './AddObjectDialog';
import { Toast } from './Toast';

export function SceneHUD({ onSave }) {
  const [showDialog, setShowDialog] = useState(false);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {/* Top-right button group */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '10px',
          pointerEvents: 'auto',
        }}
      >
        <button
          onClick={() => setShowDialog(true)}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backgroundColor: 'rgba(30, 30, 46, 0.85)',
            color: '#f1f5f9',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          Add Objects
        </button>

        <button
          onClick={onSave}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#3b82f6',
            color: '#ffffff',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}
        >
          Save
        </button>
      </div>

      {/* Add Object Dialog */}
      <AddObjectDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />

      {/* Toast notification */}
      <Toast />
    </div>
  );
}
