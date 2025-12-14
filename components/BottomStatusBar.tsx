import React from 'react';
import { Team } from '../types';

interface BottomStatusBarProps {
  teams: Team[];
  onQuitClick: () => void;
}

export const BottomStatusBar: React.FC<BottomStatusBarProps> = ({
  teams,
  onQuitClick,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 z-40 pb-safe">
      <div className="max-w-4xl mx-auto px-4 py-3 pb-4 flex items-center justify-between gap-3">
        {/* Scores - Grid layout for 4 teams */}
        <div className={`flex-1 grid gap-2 ${teams.length <= 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-zinc-800/80"
            >
              <span className="text-xs text-zinc-400 truncate flex-1">
                {team.name}
              </span>
              <span className="text-base font-bold text-white">
                {team.score}
              </span>
            </div>
          ))}
        </div>

        {/* Quit Button */}
        <button
          onClick={onQuitClick}
          className="flex-shrink-0 p-3 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 active:bg-red-500/30 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>
    </div>
  );
};
