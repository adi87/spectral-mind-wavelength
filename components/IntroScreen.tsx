import React, { useState } from 'react';

interface IntroScreenProps {
  onContinue: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onContinue }) => {
  const [skipNextTime, setSkipNextTime] = useState(false);

  const handleContinue = () => {
    if (skipNextTime) {
      localStorage.setItem('spectral-mind-skip-intro', 'true');
    }
    onContinue();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in p-6">
      {/* Logo/Title */}
      <div className="text-center mb-8">
        <img src="favicon-96x96.png" alt="Spectral Mind" className="w-20 h-20 mb-4 mx-auto" />
        <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 mb-2">
          Spectral Mind
        </h1>
        <p className="text-zinc-400 text-lg">Get on the same wavelength</p>
      </div>

      {/* Game Explainer */}
      <div className="max-w-md w-full text-center mb-6 px-2">
        <p className="text-zinc-300 text-base leading-relaxed">
          One player is the <span className="text-purple-400 font-semibold">Psychic</span> and sees a hidden target on a spectrum. 
          Give your team a clue, and they'll try to read your mind. 
          The closer they guess, the more points you score!
        </p>
      </div>

      {/* How to Play */}
      <div className="max-w-md w-full space-y-4 mb-8">
        <h2 className="text-xl font-bold text-white text-center mb-4">How to Play</h2>
        
        <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/50">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-purple-400 font-bold">1</span>
          </div>
          <div>
            <p className="text-white font-medium">The Psychic sees a target</p>
            <p className="text-zinc-400 text-sm">A secret position on a spectrum between two concepts</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/50">
          <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-pink-400 font-bold">2</span>
          </div>
          <div>
            <p className="text-white font-medium">Give a clue</p>
            <p className="text-zinc-400 text-sm">The Psychic says one word to hint at the target's position</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/50">
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-orange-400 font-bold">3</span>
          </div>
          <div>
            <p className="text-white font-medium">Team guesses</p>
            <p className="text-zinc-400 text-sm">Move the dial to where you think the target is</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-800/50">
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
            <span className="text-green-400 font-bold">4</span>
          </div>
          <div>
            <p className="text-white font-medium">Score points</p>
            <p className="text-zinc-400 text-sm">The closer your guess, the more points you earn!</p>
          </div>
        </div>
      </div>

      {/* Skip checkbox */}
      <label className="flex items-center gap-3 mb-6 cursor-pointer">
        <input
          type="checkbox"
          checked={skipNextTime}
          onChange={(e) => setSkipNextTime(e.target.checked)}
          className="w-5 h-5 rounded border-zinc-600 bg-zinc-800 text-purple-500 focus:ring-purple-500 focus:ring-offset-0 cursor-pointer"
        />
        <span className="text-zinc-400 text-sm">Don't show this again</span>
      </label>

      {/* Start Button */}
      <button
        onClick={handleContinue}
        className="w-full max-w-md px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 transition-all"
      >
        Let's Play!
      </button>
    </div>
  );
};
