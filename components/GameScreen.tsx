import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GamePhase, Team, TurnState, SpectrumCard } from '../types';
import { generateSpectrum } from '../services/spectrumService/spectrumService';
import { Dial } from './Dial';
import { Button } from './Button';

interface GameScreenProps {
  teams: Team[];
  timerDuration: number; // in seconds, 0 to disable
  onGameEnd: () => void;
  updateTeamScore: (teamIndex: number, points: number) => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ teams, timerDuration, onGameEnd, updateTeamScore }) => {
  const [phase, setPhase] = useState<GamePhase>(GamePhase.TURN_START);
  const [turn, setTurn] = useState<TurnState>({
    activeTeamIndex: 0,
    spectrum: null,
    targetValue: 50,
    guessValue: 50,
    clue: '',
    roundScore: 0,
  });
  const [isCoverClosed, setIsCoverClosed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState<{action: () => void, message: string} | null>(null);
  const [isConfirmingGuess, setIsConfirmingGuess] = useState(false);

  // Timer State
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [timeExpired, setTimeExpired] = useState(false);
  const timerRef = useRef<number | null>(null);

  // Helper to get next team index
  const nextTeamIndex = (current: number) => (current + 1) % teams.length;

  // Cleanup timer on unmount
  useEffect(() => {
    return () => stopTimer();
  }, []);

  // Timer Logic
  const startTimer = () => {
    if (timerDuration <= 0) return;
    
    stopTimer();
    setTimeLeft(timerDuration);
    setTimeExpired(false);
    
    timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
            if (prev <= 1) {
                stopTimer();
                setTimeExpired(true);
                return 0;
            }
            return prev - 1;
        });
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
    }
  };

  // Phase Transition Effect for Timer
  useEffect(() => {
    if (phase === GamePhase.PSYCHIC_VIEW || phase === GamePhase.GUESSING) {
        // Only start timer if it wasn't already expired in this phase (though phase change usually resets)
        // Actually startTurn resets timeExpired, so we are good.
        startTimer();
    } else {
        stopTimer();
        setTimeLeft(0);
        setTimeExpired(false);
    }
  }, [phase]);

  const startTurn = async () => {
    setIsLoading(true);
    setIsConfirmingGuess(false);
    // Use fallbacks immediately if needed, but try API
    const spectrum = await generateSpectrum();
    const target = Math.floor(Math.random() * 80) + 10; 

    setTurn(prev => ({
      ...prev,
      spectrum,
      targetValue: target,
      guessValue: 50,
      clue: '',
      roundScore: 0
    }));
    
    setIsCoverClosed(false);
    setTimeExpired(false); 
    setPhase(GamePhase.PSYCHIC_VIEW);
    setIsLoading(false);
  };

  const handleSkip = () => {
    setShowConfirm({
        message: "Are you sure you want to skip this turn? No points will be awarded.",
        action: () => {
            setPhase(GamePhase.TURN_START);
            setTurn(prev => ({ ...prev, activeTeamIndex: nextTeamIndex(prev.activeTeamIndex) }));
            setShowConfirm(null);
        }
    });
  };

  const handleHideAndGuess = () => {
    if (!isCoverClosed) {
       setIsCoverClosed(true);
       setTimeout(() => {
           setPhase(GamePhase.GUESSING);
       }, 500);
    } else {
        setPhase(GamePhase.GUESSING);
    }
  };

  const initiateGuessLock = () => {
    setIsConfirmingGuess(true);
  };

  const cancelGuessLock = () => {
    setIsConfirmingGuess(false);
  };

  const finalizeGuess = () => {
    calculateScore();
    setPhase(GamePhase.REVEAL);
    setIsConfirmingGuess(false);
  };

  const calculateScore = () => {
    const diff = Math.abs(turn.guessValue - turn.targetValue);
    let points = 0;
    
    if (diff <= 2) points = 5;
    else if (diff <= 5) points = 3;
    else if (diff <= 10) points = 1;
    
    setTurn(prev => ({ ...prev, roundScore: points }));
    updateTeamScore(turn.activeTeamIndex, points);
  };
  
  const handleTimeExpiration = () => {
      // Force 0 score and move to reveal
      setTurn(prev => ({ ...prev, roundScore: 0 }));
      updateTeamScore(turn.activeTeamIndex, 0);
      setPhase(GamePhase.REVEAL);
  };

  const finishTurn = () => {
    setPhase(GamePhase.TURN_START);
    setTurn(prev => ({ ...prev, activeTeamIndex: nextTeamIndex(prev.activeTeamIndex) }));
  };

  const endGame = () => {
    setShowConfirm({
        message: "End the game and see final results?",
        action: () => {
            onGameEnd();
            setShowConfirm(null);
        }
    });
  };

  const handleDialChange = useCallback((val: number) => {
    setTurn(prev => ({ ...prev, guessValue: val }));
  }, []);

  // Timer Component
  const TimerDisplay = () => {
    if (timerDuration <= 0 || (phase !== GamePhase.PSYCHIC_VIEW && phase !== GamePhase.GUESSING)) return null;

    const isUrgent = timeLeft <= 10;
    const isFinished = timeLeft === 0;

    return (
        <div className={`absolute top-0 right-0 m-2 px-3 py-1 rounded-full font-mono font-bold text-sm shadow-lg transition-colors duration-300 z-50
            ${isFinished ? 'bg-red-600 text-white animate-pulse' : 
              isUrgent ? 'bg-orange-500 text-white' : 'bg-gray-800 text-green-400 border border-gray-700'}
        `}>
            {isFinished ? "TIME'S UP!" : `${timeLeft}s`}
        </div>
    );
  };

  const renderPhaseContent = () => {
    // Turn Start View
    if (phase === GamePhase.TURN_START) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in p-4 w-full">
          <div className="text-gray-400 text-sm uppercase tracking-widest">Up Next</div>
          <h2 className="text-5xl font-black text-white text-center mb-8">{teams[turn.activeTeamIndex].name}</h2>
          <div className="text-center space-y-2 mb-8">
              <p className="text-gray-300">Pass the device to your <span className="text-purple-400 font-bold">Psychic</span>.</p>
              <p className="text-xs text-gray-500">Only the Psychic should see the next screen!</p>
          </div>
          <Button onClick={startTurn} disabled={isLoading} className="w-full max-w-sm">
            {isLoading ? 'Loading Spectrum...' : 'I am the Psychic'}
          </Button>
        </div>
      );
    }

    // Psychic View
    if (phase === GamePhase.PSYCHIC_VIEW) {
      return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 space-y-6 animate-fade-in pb-20 relative">
          <TimerDisplay />
          
          <div className="bg-purple-900/30 border border-purple-500/30 rounded-lg p-4 w-full text-center mt-6">
               <h3 className="text-purple-300 font-bold uppercase text-xs tracking-wider mb-1">Psychic Instructions</h3>
               <p className="text-sm">1. Look at the target zone below.<br/>2. Think of a clue.<br/>3. Hide the target.<br/>4. Say your clue out loud.</p>
          </div>

          <Dial 
            targetValue={turn.targetValue}
            currentValue={turn.targetValue}
            isInteractive={false}
            isRevealed={false} 
            leftLabel={turn.spectrum?.left || '...'}
            rightLabel={turn.spectrum?.right || '...'}
            isCoverClosed={isCoverClosed}
            showNeedle={false} 
          />

          <div className="flex flex-col w-full max-w-sm gap-3 pt-4 relative z-50">
              {timeExpired ? (
                  <Button variant="danger" fullWidth onClick={handleTimeExpiration} className="animate-pulse">
                      Time Expired! End Turn (0 Pts)
                  </Button>
              ) : (
                  <>
                    <div className="flex gap-3">
                        <Button variant="secondary" onClick={handleSkip} className="flex-1">Skip Turn</Button>
                        <Button 
                            variant={isCoverClosed ? "secondary" : "danger"} 
                            onClick={() => setIsCoverClosed(!isCoverClosed)}
                            className="flex-1"
                        >
                            {isCoverClosed ? "Show Target" : "Hide Target"}
                        </Button>
                    </div>
                    
                    <Button 
                        variant="primary" 
                        fullWidth
                        onClick={handleHideAndGuess}
                        disabled={!isCoverClosed}
                        className={!isCoverClosed ? 'opacity-50 cursor-not-allowed' : ''}
                    >
                        Give Device to Team
                    </Button>
                  </>
              )}
          </div>
        </div>
      );
    }

    // Guessing View
    if (phase === GamePhase.GUESSING) {
      return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 space-y-6 animate-fade-in pb-20 relative">
           <TimerDisplay />

           <div className="text-center mt-8">
              <h3 className="text-2xl font-bold text-white">{teams[turn.activeTeamIndex].name}</h3>
              <p className="text-gray-400 text-sm">Listen to the clue and position the dial.</p>
           </div>

           <Dial 
            targetValue={turn.targetValue}
            currentValue={turn.guessValue}
            onChange={handleDialChange}
            isInteractive={!timeExpired && !isConfirmingGuess} 
            isRevealed={false}
            leftLabel={turn.spectrum?.left || ''}
            rightLabel={turn.spectrum?.right || ''}
            isCoverClosed={true}
            showNeedle={true}
          />

          <div className="pt-8 w-full max-w-sm relative z-50">
              {timeExpired ? (
                   <Button variant="danger" fullWidth onClick={handleTimeExpiration} className="animate-pulse py-4 text-lg">
                      Time Expired! See Result
                  </Button>
              ) : isConfirmingGuess ? (
                 <div className="flex gap-3 animate-fade-in">
                    <Button 
                        variant="secondary" 
                        fullWidth 
                        onClick={cancelGuessLock} 
                        className="py-4 text-lg"
                    >
                        Cancel
                    </Button>
                    <Button 
                        variant="primary" 
                        fullWidth 
                        onClick={finalizeGuess} 
                        className="py-4 text-lg shadow-2xl bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500"
                    >
                        Confirm
                    </Button>
                 </div>
              ) : (
                  <Button 
                    fullWidth 
                    onClick={initiateGuessLock} 
                    className="py-4 text-lg shadow-2xl"
                    type="button"
                  >
                    Lock In Guess
                  </Button>
              )}
          </div>
        </div>
      );
    }

    // Reveal View
    if (phase === GamePhase.REVEAL) {
      return (
        <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 space-y-6 animate-fade-in pb-20">
          <div className="text-center space-y-2">
              <div className="text-6xl font-black mb-2 animate-bounce">
                  +{turn.roundScore}
              </div>
              <div className={`text-xl font-bold ${
                  turn.roundScore === 5 ? 'text-green-400' :
                  turn.roundScore === 3 ? 'text-blue-400' :
                  turn.roundScore === 1 ? 'text-yellow-400' : 'text-red-400'
              }`}>
                  {turn.roundScore === 5 ? 'PERFECT!' : 
                   turn.roundScore === 3 ? 'GREAT!' :
                   turn.roundScore === 1 ? 'CLOSE!' : 'MISS!'}
              </div>
          </div>

          <Dial 
            targetValue={turn.targetValue}
            currentValue={turn.guessValue}
            isInteractive={false}
            isRevealed={true}
            leftLabel={turn.spectrum?.left || ''}
            rightLabel={turn.spectrum?.right || ''}
            isCoverClosed={false}
            showNeedle={true}
          />

          <div className="flex flex-col gap-3 w-full max-w-sm pt-4 relative z-50">
              <Button onClick={finishTurn}>Next Team</Button>
              <Button variant="ghost" onClick={endGame}>Finish Game</Button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <>
        {renderPhaseContent()}

        {showConfirm && (
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl animate-fade-in">
                    <p className="text-lg font-medium text-center mb-6">{showConfirm.message}</p>
                    <div className="flex gap-4">
                        <Button variant="secondary" fullWidth onClick={() => setShowConfirm(null)}>Cancel</Button>
                        <Button fullWidth onClick={showConfirm.action}>Confirm</Button>
                    </div>
                </div>
            </div>
        )}
    </>
  );
};