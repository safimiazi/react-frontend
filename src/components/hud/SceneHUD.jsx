import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddObjectDialog } from "./AddObjectDialog";
import { Toast } from "./Toast";
import { useScene } from "../../hooks/useScene";
import useAuth from "../../hooks/useAuth";

export function SceneHUD({ onSave }) {
  const [showDialog, setShowDialog] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const {
    objects,
    clearScene,
    selectedId,
    setSelectedId,
    updateScale,
    removeObject,
  } = useScene();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const selectedObj = objects.find((o) => o.instanceId === selectedId) ?? null;

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const handleClearConfirm = () => {
    clearScene();
    setShowClearConfirm(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* ── Top-right button group ── */}
      <div className="absolute top-4 right-4 flex gap-2.5 items-center pointer-events-auto">
        <div
          title={`${objects.length} object${objects.length !== 1 ? "s" : ""} in scene`}
          className="px-2.5 py-1 rounded-full bg-[rgba(30,30,46,0.85)] border border-white/15 text-slate-400 text-xs font-medium select-none backdrop-blur-md"
        >
          {objects.length} object{objects.length !== 1 ? "s" : ""}
        </div>

        <button
          onClick={() => setShowDialog(true)}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border border-white/20 bg-[rgba(30,30,46,0.85)] text-slate-100"
        >
          + Add Object
        </button>

        {objects.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer bg-red-500 text-white"
          >
            Clear Scene
          </button>
        )}

        <button
          onClick={onSave}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer bg-blue-500 text-white"
        >
          Save
        </button>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border border-white/15 bg-[rgba(30,30,46,0.7)] text-slate-400"
        >
          Log Out
        </button>
      </div>

      {/* ── Selected-object scale panel ── */}
      {selectedObj && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-[rgba(20,20,34,0.92)] border border-white/15 rounded-lg px-5 py-3 flex items-center gap-3 pointer-events-auto backdrop-blur-md shadow-2xl min-w-[320px]">
          {/* Object label */}
          <span className="text-[#94a3b8] text-[13px] whitespace-nowrap capitalize">
            {selectedObj.type}
          </span>

          {/* Scale label */}
          <span className="text-[#64748b] text-[12px] whitespace-nowrap">
            Size
          </span>

          {/* Decrease button */}
          <button
            onClick={() =>
              updateScale(
                selectedObj.instanceId,
                Math.max(0.2, +(selectedObj.scale - 0.1).toFixed(2)),
              )
            }
            title="Shrink"
            className="px-2.5 py-1 rounded-md text-base text-slate-300 bg-[rgba(255,255,255,0.07)] border border-white/12 leading-none cursor-pointer"
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
            onChange={(e) =>
              updateScale(selectedObj.instanceId, parseFloat(e.target.value))
            }
            className="flex-1 accent-[#3b82f6] cursor-pointer"
          />

          {/* Increase button */}
          <button
            onClick={() =>
              updateScale(
                selectedObj.instanceId,
                Math.min(4, +(selectedObj.scale + 0.1).toFixed(2)),
              )
            }
            title="Grow"
            className="px-2.5 py-1 rounded-md text-base text-slate-300 bg-[rgba(255,255,255,0.07)] border border-white/12 leading-none cursor-pointer"
          >
            +
          </button>

          {/* Current value */}
          <span className="text-[#f1f5f9] text-[13px] min-w-[36px] text-right">
            {(selectedObj.scale ?? 1).toFixed(2)}×
          </span>

          {/* Reset */}
          <button
            onClick={() => updateScale(selectedObj.instanceId, 1)}
            title="Reset size"
            className="px-2 py-1 text-[10px] rounded-md text-slate-300 bg-[rgba(255,255,255,0.07)] border border-white/12"
          >
            Reset
          </button>

          {/* Delete */}
          <button
            onClick={() => removeObject(selectedObj.instanceId)}
            title="Delete object"
            className="px-2.5 py-1 rounded-md text-base bg-[rgba(239,68,68,0.15)] text-[#f87171] border border-white/12"
          >
            🗑
          </button>

          {/* Close panel */}
          <button
            onClick={() => setSelectedId(null)}
            title="Deselect"
            className="px-2 py-1 rounded-md text-slate-300 bg-[rgba(255,255,255,0.07)] border border-white/12"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Bottom-left hint ── */}
      <div className="absolute bottom-4 left-4 text-[12px] text-[rgba(255,255,255,0.3)] pointer-events-none select-none">
        Click to select · Drag to move · Double-click to delete
      </div>

      <AddObjectDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />

      {showClearConfirm && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowClearConfirm(false);
          }}
          className="absolute inset-0 bg-black/55 flex items-center justify-center z-[600] pointer-events-auto"
        >
          <div className="bg-[#1e1e2e] border border-[#374151] rounded-lg p-6 min-w-[300px] max-w-[380px] text-[#f1f5f9] shadow-2xl">
            <h2 className="m-0 mb-2 text-[18px] text-[#f8fafc]">
              Clear Scene?
            </h2>
            <p className="m-0 mb-6 text-[14px] text-[#94a3b8]">
              All {objects.length} object{objects.length !== 1 ? "s" : ""} will
              be removed.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer border border-white/15 bg-[rgba(30,30,46,0.7)] text-slate-400"
              >
                Cancel
              </button>
              <button
                onClick={handleClearConfirm}
                className="px-4 py-2 rounded-lg text-sm font-medium cursor-pointer bg-red-500 text-white"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}
