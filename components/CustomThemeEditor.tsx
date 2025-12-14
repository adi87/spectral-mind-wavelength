import React, { useState, useEffect } from 'react';
import { SpectrumCard } from '../types';
import { getCustomCards, addCustomCard, removeCustomCard, clearCustomCards } from '../services/spectrumService/themes/custom';

interface CustomThemeEditorProps {
  onClose: () => void;
  onPlay: () => void;
}

export const CustomThemeEditor: React.FC<CustomThemeEditorProps> = ({ onClose, onPlay }) => {
  const [cards, setCards] = useState<SpectrumCard[]>([]);
  const [leftInput, setLeftInput] = useState('');
  const [rightInput, setRightInput] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setCards(getCustomCards());
  }, []);

  const handleAddCard = () => {
    if (leftInput.trim() && rightInput.trim()) {
      const newCards = addCustomCard({ left: leftInput.trim(), right: rightInput.trim() });
      setCards(newCards);
      setLeftInput('');
      setRightInput('');
    }
  };

  const handleRemoveCard = (index: number) => {
    const newCards = removeCustomCard(index);
    setCards(newCards);
  };

  const handleClearAll = () => {
    clearCustomCards();
    setCards([]);
    setShowClearConfirm(false);
  };

  const canPlay = cards.length >= 3;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto animate-fade-in p-4 pb-12">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-6">
        <button
          onClick={onClose}
          className="p-2 text-zinc-400 hover:text-white transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          Custom Theme
        </h1>
        <div className="w-10" />
      </div>

      {/* Add Card Form */}
      <div className="w-full bg-zinc-800/50 rounded-2xl p-4 mb-6">
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Add a Spectrum Card</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Left side (e.g., Hot)"
            value={leftInput}
            onChange={(e) => setLeftInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={30}
          />
          <input
            type="text"
            placeholder="Right side (e.g., Cold)"
            value={rightInput}
            onChange={(e) => setRightInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            maxLength={30}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCard()}
          />
          <button
            onClick={handleAddCard}
            disabled={!leftInput.trim() || !rightInput.trim()}
            className="px-6 py-3 rounded-xl bg-purple-500 text-white font-medium hover:bg-purple-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            Add
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-zinc-400">
            Your Cards ({cards.length})
          </h2>
          {cards.length > 0 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {cards.length === 0 ? (
          <div className="text-center py-12 text-zinc-500">
            <p className="text-lg mb-2">No cards yet</p>
            <p className="text-sm">Add at least 3 cards to play</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-2">
            {cards.map((card, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 px-4 py-3 rounded-xl bg-zinc-800/50 group"
              >
                <div className="flex-1 flex items-center gap-2 min-w-0">
                  <span className="text-purple-400 font-medium truncate">{card.left}</span>
                  <span className="text-zinc-600">↔</span>
                  <span className="text-pink-400 font-medium truncate">{card.right}</span>
                </div>
                <button
                  onClick={() => handleRemoveCard(index)}
                  className="p-1 text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Play Button */}
      <button
        onClick={onPlay}
        disabled={!canPlay}
        className={`w-full max-w-md px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transition-all active:scale-95 ${
          canPlay
            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-purple-500/25 hover:shadow-purple-500/40'
            : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
        }`}
      >
        {canPlay ? 'Play with Custom Theme' : `Add ${3 - cards.length} more card${3 - cards.length === 1 ? '' : 's'}`}
      </button>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-800 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-zinc-700 animate-fade-in">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Clear All Cards?</h3>
              <p className="text-zinc-400 text-sm">
                This will delete all your custom cards. This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white font-medium hover:bg-zinc-600 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-400 active:scale-95 transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
