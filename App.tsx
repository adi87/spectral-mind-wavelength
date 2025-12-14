import React, { useState } from 'react';
import { Team, GamePhase } from './types';
import { IntroScreen } from './components/IntroScreen';
import { ThemePicker } from './components/ThemePicker';
import { SetupScreen } from './components/SetupScreen';
import { GameScreen } from './components/GameScreen';
import { Scoreboard } from './components/Scoreboard';
import { TopBar } from './components/TopBar';
import { BottomStatusBar } from './components/BottomStatusBar';
import { QuitConfirmModal } from './components/QuitConfirmModal';
import { Theme } from './services/spectrumService/themes';
import { setActiveTheme } from './services/spectrumService/spectrumService';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>(() => {
    const skipIntro = localStorage.getItem('spectral-mind-skip-intro');
    return skipIntro === 'true' ? GamePhase.THEME_SELECT : GamePhase.INTRO;
  });
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
      <TopBar
        showQuitButton={phase === GamePhase.SETUP}
        isFullscreen={isFullscreen}
        onQuitClick={handleQuitClick}
        onToggleFullscreen={toggleFullscreen}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col">
        {phase === GamePhase.INTRO && <IntroScreen onContinue={() => setPhase(GamePhase.THEME_SELECT)} />}
        
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
        <BottomStatusBar teams={teams} onQuitClick={handleQuitClick} />
      )}

      {/* Quit Confirmation Modal */}
      {showQuitConfirm && (
        <QuitConfirmModal onConfirm={handleConfirmQuit} onCancel={handleCancelQuit} />
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