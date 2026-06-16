import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AddObjectDialog } from "./AddObjectDialog";
import { Toast } from "./Toast";
import { useScene } from "../../hooks/useScene";
import useAuth from "../../hooks/useAuth";
import { 
  Plus, 
  Trash2, 
  Save, 
  LogOut, 
  Minus, 
  RotateCcw,
  X,
  Layers,
  AlertCircle,
  ChevronRight
} from 'lucide-react';

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
      <div className="absolute top-4 right-4 flex gap-2 items-center pointer-events-auto">
        {/* Object Counter */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1e1e2e]/90 backdrop-blur-md border border-gray-700 text-gray-300 text-xs font-medium shadow-lg">
          <Layers size={14} className="text-orange-500" />
          <span>{objects.length} object{objects.length !== 1 ? "s" : ""}</span>
        </div>

        {/* Add Object Button */}
        <button
          onClick={() => setShowDialog(true)}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 shadow-lg hover:shadow-orange-500/25"
        >
          <Plus size={16} />
          Add Object
        </button>

        {/* Clear Scene Button */}
        {objects.length > 0 && (
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer bg-red-500/90 hover:bg-red-600 text-white transition-all duration-200 shadow-lg"
          >
            <Trash2 size={16} />
            Clear
          </button>
        )}

        {/* Save Button */}
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer bg-emerald-500 hover:bg-emerald-600 text-white transition-all duration-200 shadow-lg"
        >
          <Save size={16} />
          Save
        </button>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer border border-gray-600 bg-[#1e1e2e]/90 backdrop-blur-md text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* ── Selected-object scale panel ── */}
      {selectedObj && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#1e1e2e]/95 backdrop-blur-md border border-gray-700 rounded-xl px-4 py-2.5 flex items-center gap-2 pointer-events-auto shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
          {/* Object type badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20">
            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-400 text-xs font-medium capitalize">
              {selectedObj.type}
            </span>
          </div>

          <div className="h-6 w-px bg-gray-700" />

          {/* Size label */}
          <span className="text-gray-400 text-xs">Size</span>

          {/* Decrease button */}
          <button
            onClick={() =>
              updateScale(
                selectedObj.instanceId,
                Math.max(0.2, +(selectedObj.scale - 0.1).toFixed(2)),
              )
            }
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 bg-gray-800/50 border border-gray-700 hover:bg-gray-700 hover:border-orange-500/50 hover:text-orange-400 transition-all duration-200"
          >
            <Minus size={14} />
          </button>

          {/* Slider */}
          <div className="relative w-48">
            <input
              type="range"
              min="0.2"
              max="4"
              step="0.05"
              value={selectedObj.scale ?? 1}
              onChange={(e) =>
                updateScale(selectedObj.instanceId, parseFloat(e.target.value))
              }
              className="w-full h-1.5 rounded-lg appearance-none cursor-pointer bg-gray-700"
              style={{
                background: `linear-gradient(to right, #f97316 0%, #f97316 ${((selectedObj.scale ?? 1 - 0.2) / 3.8) * 100}%, #374151 ${((selectedObj.scale ?? 1 - 0.2) / 3.8) * 100}%, #374151 100%)`
              }}
            />
          </div>

          {/* Increase button */}
          <button
            onClick={() =>
              updateScale(
                selectedObj.instanceId,
                Math.min(4, +(selectedObj.scale + 0.1).toFixed(2)),
              )
            }
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 bg-gray-800/50 border border-gray-700 hover:bg-gray-700 hover:border-orange-500/50 hover:text-orange-400 transition-all duration-200"
          >
            <ChevronRight size={14} />
          </button>

          {/* Current value */}
          <span className="text-orange-400 text-sm font-mono min-w-[45px] text-right font-semibold">
            {(selectedObj.scale ?? 1).toFixed(2)}x
          </span>

          {/* Reset button */}
          <button
            onClick={() => updateScale(selectedObj.instanceId, 1)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 bg-gray-800/50 border border-gray-700 hover:bg-gray-700 hover:text-orange-400 transition-all duration-200"
          >
            <RotateCcw size={14} />
          </button>

          {/* Delete button */}
          <button
            onClick={() => removeObject(selectedObj.instanceId)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
          >
            <Trash2 size={14} />
          </button>

          {/* Close panel button */}
          <button
            onClick={() => setSelectedId(null)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 bg-gray-800/50 border border-gray-700 hover:bg-gray-700 hover:text-white transition-all duration-200"
          >
            <X size={14} />
          </button>
        </div>
      )}



      {/* Add Object Dialog */}
      <AddObjectDialog
        isOpen={showDialog}
        onClose={() => setShowDialog(false)}
      />

      {/* Clear Confirmation Dialog */}
      {showClearConfirm && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowClearConfirm(false);
          }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[600] pointer-events-auto animate-in fade-in duration-200"
        >
          <div className="bg-[#1e1e2e] border border-gray-700 rounded-xl p-5 min-w-[340px] shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={20} className="text-red-500" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-100 mb-1">
                  Clear Scene?
                </h2>
                <p className="text-sm text-gray-400">
                  All {objects.length} object{objects.length !== 1 ? "s" : ""} will be permanently removed from the scene.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end mt-5">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer border border-gray-600 bg-transparent text-gray-300 hover:bg-gray-800 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleClearConfirm}
                className="px-4 py-1.5 rounded-lg text-sm font-medium cursor-pointer bg-red-500 text-white hover:bg-red-600 transition-all duration-200 shadow-lg"
              >
                Clear Scene
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast />
    </div>
  );
}