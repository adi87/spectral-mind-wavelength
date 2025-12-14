import React from 'react';

interface TopBarProps {
  showQuitButton: boolean;
  isFullscreen: boolean;
  onQuitClick: () => void;
  onToggleFullscreen: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  showQuitButton,
  isFullscreen,
  onQuitClick,
  onToggleFullscreen,
}) => {
  return (
    <div className="w-full p-4 flex justify-between items-center bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800">
      <div className="font-bold text-lg tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
        Spectral Mind
      </div>
      <div className="flex gap-2 items-center">
        {showQuitButton && (
          <button
            onClick={onQuitClick}
            className="p-2 text-zinc-400 hover:text-red-400 transition-colors"
            title="Quit Game"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        )}
        <button onClick={onToggleFullscreen} className="p-2 text-zinc-400 hover:text-white transition-colors">
          {isFullscreen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3v3a2 2 0 0 1-2 2H3"/>
              <path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
              <path d="M3 16h3a2 2 0 0 1 2 2v3"/>
              <path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h6v6"/>
              <path d="M9 21H3v-6"/>
              <path d="M21 3l-7 7"/>
              <path d="M3 21l7-7"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};
