import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AddObjectDialog } from './AddObjectDialog';
import { Toast } from './Toast';
import { useScene } from '../../hooks/useScene';
import useAuth from '../../hooks/useAuth';

export function SceneHUD({ onSave }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { objects, clearScene, selectedId, setSelectedId, updateScale, removeObject } = useScene();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const selectedObj = objects.find((o) => o.instanceId === selectedId) ?? null;

  const handleLogout = () => {
    logout();
    navigate('/', { replace: true });
  };

  const handleClearConfirm = () => {
    clearScene();
    setShowClearConfirm(false);
  };

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
      {/* ── Top-right button group ── */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '10px',
          alignItems: 'center',
          pointerEvents: 'auto',
        }}
      >
        <div
          title={`${objects.length} object${objects.length !== 1 ? 's' : ''} in scene`}
          style={badgeStyle}
        >
          {objects.length} object{objects.length !== 1 ? 's' : ''}
        </div>

        <button onClick={() => setShowDialog(true)} style={btnStyle('secondary')}>
          + Add Object
        </button>

        {objects.length > 0 && (
          <button onClick={() => setShowClearConfirm(true)} style={btnStyle('danger')}>
            Clear Scene
          </button>
        )}

        <button onClick={onSave} style={btnStyle('primary')}>
          Save
        </button>

        <button onClick={handleLogout} style={btnStyle('ghost')}>
          Log Out
        </button>
      </div>

      {/* ── Selected-object scale panel ── */}
      {selectedObj && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(20, 20, 34, 0.92)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            pointerEvents: 'auto',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            minWidth: '320px',
          }}
        >
          {/* Object label */}
          <span style={{ color: '#94a3b8', fontSize: '13px', whiteSpace: 'nowrap', textTransform: 'capitalize' }}>
            {selectedObj.type}
          </span>

          {/* Scale label */}
          <span style={{ color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>Size</span>

          {/* Decrease button */}
          <button
            onClick={() => updateScale(selectedObj.instanceId, Math.max(0.2, +(selectedObj.scale - 0.1).toFixed(2)))}
            style={scaleBtn}
            title="Shrink"
          >
            −
          </button>

          {/* Slider */}
          <input
            type="range"
            min="0.2"
            max="4"
            step="0.05"
            value={selectedObj.scale ?? 1}
            onChange={(e) => updateScale(selectedObj.instanceId, parseFloat(e.target.value))}
            style={{ flex: 1, accentColor: '#3b82f6', cursor: 'pointer' }}
          />

          {/* Increase button */}
          <button
            onClick={() => updateScale(selectedObj.instanceId, Math.min(4, +(selectedObj.scale + 0.1).toFixed(2)))}
            style={scaleBtn}
            title="Grow"
          >
            +
          </button>

          {/* Current value */}
          <span style={{ color: '#f1f5f9', fontSize: '13px', minWidth: '36px', textAlign: 'right' }}>
            {(selectedObj.scale ?? 1).toFixed(2)}×
          </span>

          {/* Reset */}
          <button
            onClick={() => updateScale(selectedObj.instanceId, 1)}
            title="Reset size"
            style={{ ...scaleBtn, fontSize: '10px', padding: '4px 8px' }}
          >
            Reset
          </button>

          {/* Delete */}
          <button
            onClick={() => removeObject(selectedObj.instanceId)}
            title="Delete object"
            style={{ ...scaleBtn, backgroundColor: 'rgba(239,68,68,0.15)', color: '#f87171' }}
          >
            🗑
          </button>

          {/* Close panel */}
          <button
            onClick={() => setSelectedId(null)}
            title="Deselect"
            style={{ ...scaleBtn, padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Bottom-left hint ── */}
      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '12px',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        Click to select · Drag to move · Double-click to delete
      </div>

      <AddObjectDialog isOpen={showDialog} onClose={() => setShowDialog(false)} />

      {showClearConfirm && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowClearConfirm(false); }}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 600,
            pointerEvents: 'auto',
          }}
        >
          <div style={modalStyle}>
            <h2 style={{ margin: '0 0 8px', fontSize: '18px', color: '#f8fafc' }}>Clear Scene?</h2>
            <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#94a3b8' }}>
              All {objects.length} object{objects.length !== 1 ? 's' : ''} will be removed.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button onClick={() => setShowClearConfirm(false)} style={btnStyle('ghost')}>Cancel</button>
              <button onClick={handleClearConfirm} style={btnStyle('danger')}>Clear</button>
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}

function btnStyle(variant) {
  const base = {
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    backdropFilter: 'blur(8px)',
    transition: 'opacity 0.15s',
  };
  switch (variant) {
    case 'primary':
      return { ...base, border: 'none', backgroundColor: '#3b82f6', color: '#fff' };
    case 'secondary':
      return { ...base, border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(30,30,46,0.85)', color: '#f1f5f9' };
    case 'danger':
      return { ...base, border: 'none', backgroundColor: '#ef4444', color: '#fff' };
    case 'ghost':
    default:
      return { ...base, border: '1px solid rgba(255,255,255,0.15)', backgroundColor: 'rgba(30,30,46,0.7)', color: '#94a3b8' };
  }
}

const badgeStyle = {
  padding: '4px 10px',
  borderRadius: '99px',
  backgroundColor: 'rgba(30, 30, 46, 0.85)',
  border: '1px solid rgba(255,255,255,0.15)',
  color: '#94a3b8',
  fontSize: '12px',
  fontWeight: 500,
  backdropFilter: 'blur(8px)',
  userSelect: 'none',
};

const scaleBtn = {
  padding: '4px 10px',
  borderRadius: '6px',
  border: '1px solid rgba(255,255,255,0.12)',
  backgroundColor: 'rgba(255,255,255,0.07)',
  color: '#cbd5e1',
  fontSize: '16px',
  cursor: 'pointer',
  lineHeight: 1,
};

const modalStyle = {
  backgroundColor: '#1e1e2e',
  border: '1px solid #374151',
  borderRadius: '12px',
  padding: '24px',
  minWidth: '300px',
  maxWidth: '380px',
  color: '#f1f5f9',
  boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
};
