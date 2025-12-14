import React, { useState, useEffect } from 'react';
import { Team, GamePhase } from './types';
import { ThemePicker } from './components/ThemePicker';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { Scoreboard } from './components/Scoreboard';
import { Theme } from './services/spectrumService/themes';
import { setActiveTheme, getActiveTheme } from './services/spectrumService/spectrumService';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.THEME_SELECT);
  const [teams, setTeams] = useState<Team[]>([]);
  const [timerDuration, setTimerDuration] = useState<number>(60);
  const [selectedTheme, setSelectedTheme] = useState<Theme | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState(false);

  // Helper for PWA-like Fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch((e) => {
            console.log(e);
        });
        setIsFullscreen(true);
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    }
  };

  const handleStartGame = (configuredTeams: Team[], configuredTimer: number) => {
    setTeams(configuredTeams);
    setTimerDuration(configuredTimer);
    setPhase(GamePhase.TURN_START);
  };

  const handleUpdateScore = (teamIndex: number, points: number) => {
    setTeams(prev => {
        const newTeams = [...prev];
        newTeams[teamIndex].score += points;
        return newTeams;
    });
  };

  const handleGameEnd = () => {
    setPhase(GamePhase.GAME_OVER);
  };

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    setActiveTheme(theme);
    setPhase(GamePhase.SETUP);
  };

  const handleChangeTheme = () => {
    setPhase(GamePhase.THEME_SELECT);
  };

  const handleQuitClick = () => {
    setShowQuitConfirm(true);
  };

  const handleConfirmQuit = () => {
    setShowQuitConfirm(false);
    setPhase(GamePhase.THEME_SELECT);
    setTeams([]);
    setSelectedTheme(null);
  };

  const handleCancelQuit = () => {
    setShowQuitConfirm(false);
  };

  const handleRestart = () => {
    setPhase(GamePhase.THEME_SELECT);
    setTeams([]);
    setSelectedTheme(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white overflow-hidden flex flex-col">
      {/* Top Bar */}
      <div className="w-full p-4 flex justify-between items-center bg-zinc-900/80 backdrop-blur-md sticky top-0 z-40 border-b border-zinc-800">
        <div className="font-bold text-lg tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500">
            Spectral Mind
        </div>
        <div className="flex gap-2 items-center">
            {phase === GamePhase.SETUP && (
              <button 
                onClick={handleQuitClick} 
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
            <button onClick={toggleFullscreen} className="p-2 text-zinc-400 hover:text-white transition-colors">
                {isFullscreen ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
                )}
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {phase === GamePhase.THEME_SELECT && <ThemePicker onSelectTheme={handleThemeSelect} />}
        
        {phase === GamePhase.SETUP && selectedTheme && (
          <SetupScreen 
            onStartGame={handleStartGame} 
            selectedTheme={selectedTheme}
            onChangeTheme={handleChangeTheme}
          />
        )}
        
        {(phase === GamePhase.TURN_START || 
          phase === GamePhase.PSYCHIC_VIEW || 
          phase === GamePhase.GUESSING || 
          phase === GamePhase.REVEAL) && (
          <GameScreen 
            teams={teams} 
            timerDuration={timerDuration}
            onGameEnd={handleGameEnd} 
            updateTeamScore={handleUpdateScore}
          />
        )}

        {phase === GamePhase.GAME_OVER && (
            <Scoreboard teams={teams} onRestart={handleRestart} />
        )}
      </main>

      {/* Bottom Status Bar - During Gameplay */}
      {(phase === GamePhase.TURN_START || 
        phase === GamePhase.PSYCHIC_VIEW || 
        phase === GamePhase.GUESSING || 
        phase === GamePhase.REVEAL) && (
        <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-md border-t border-zinc-800 z-40 pb-safe">
          <div className="max-w-4xl mx-auto px-4 py-3 pb-4 flex items-center justify-between gap-3">
            {/* Scores - Grid layout for 4 teams */}
            <div className={`flex-1 grid gap-2 ${teams.length <= 2 ? 'grid-cols-2' : 'grid-cols-4'}`}>
              {teams.map((team, idx) => (
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
              onClick={handleQuitClick}
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
      )}

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
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
                onClick={handleCancelQuit}
                className="flex-1 px-4 py-3 rounded-xl bg-zinc-700 text-white font-medium hover:bg-zinc-600 active:scale-95 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmQuit}
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-400 active:scale-95 transition-all"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CSS for animations and safe areas */}
      <style>{`
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
        .pb-safe {
            padding-bottom: env(safe-area-inset-bottom, 0px);
        }
      `}</style>
    </div>
  );
}