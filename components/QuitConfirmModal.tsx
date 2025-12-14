import React from 'react';

interface QuitConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const QuitConfirmModal: React.FC<QuitConfirmModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-zinc-700 animate-fade-in">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Quit Game?</h3>
          <p className="text-zinc-400 text-sm">
            All progress will be lost. Are you sure you want to quit?
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white font-medium hover:bg-zinc-600 active:scale-95 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-400 active:scale-95 transition-all"
          >
            Quit
          </button>
        </div>
      </div>
    </div>
  );
};
