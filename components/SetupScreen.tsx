import React, { useState } from 'react';
import { Button } from './Button';
import { Team } from '../types';
import { Theme } from '../services/spectrumService/themes';

const FUN_TEAM_NAMES = [
  "Mind Readers", "Vibe Checkers", "Psychic Pineapples", "Wavelength Wizards",
  "Frequency Freaks", "Telepathic Tacos", "Spectral Spies", "Quantum Quokkas",
  "Cosmic Cruisers", "Brainy Bunch", "Thought Police", "Mental Gymnasts",
  "Third Eye Blind", "Crystal Ballers", "Future Tellers", "Remote Viewers",
  "Astral Travelers", "Ghost Hunters", "Medium Rare", "ESP-ecially Good",
  "Brainwave Surfers", "Synapse Snappers", "Neural Network", "Cerebral Assassins",
  "Thought Bubbles", "Mind Melders", "Head Case", "Psy-Kicks",
  "Telekinesis Club", "Precognition Pros", "Deja Vu", "Sixth Sense",
  "Mystic Moguls", "Oracle Squad", "Prophecy Peeps", "Clairvoyant Crew",
  "Tarot Terrors", "Zodiac Zebras", "Horoscope Heroes", "Palm Readers",
  "Tea Leaf Team", "Ouija Boarders", "Seance Squad", "Ectoplasm Enthusiasts",
  "Supernatural Squad", "Paranormal Pals", "Alien Abductees", "Tin Foil Hats",
  "Conspiracy Theorists", "Area 51 Raiders"
];

interface SetupScreenProps {
  onStartGame: (teams: Team[], timerDuration: number) => void;
  selectedTheme: Theme;
  onChangeTheme: () => void;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStartGame, selectedTheme, onChangeTheme }) => {
  // Initialize with 2 random unique names
  const [teamNames, setTeamNames] = useState<string[]>(() => {
    const shuffled = [...FUN_TEAM_NAMES].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  });
  
  const [timerDuration, setTimerDuration] = useState<number>(60);

  const addTeam = () => {
    if (teamNames.length < 4) {
      const available = FUN_TEAM_NAMES.filter(n => !teamNames.includes(n));
      const newName = available.length > 0 
        ? available[Math.floor(Math.random() * available.length)] 
        : `Team ${String.fromCharCode(65 + teamNames.length)}`;
      setTeamNames([...teamNames, newName]);
    }
  };

  const removeTeam = (index: number) => {
    if (teamNames.length > 2) {
      const newNames = [...teamNames];
      newNames.splice(index, 1);
      setTeamNames(newNames);
    }
  };

  const updateName = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const handleStart = () => {
    const teams: Team[] = teamNames.map((name, idx) => ({
      id: `team-${idx}`,
      name: name.trim() || `Team ${idx + 1}`,
      score: 0
    }));
    onStartGame(teams, timerDuration);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-fade-in p-4">
      <div className="text-center space-y-2">
        <h1 className="text-4xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Spectral Mind
        </h1>
        <p className="text-gray-400">Get on the same wavelength.</p>
      </div>

      <div className="w-full max-w-md space-y-6">
        {/* Selected Theme */}
        <div className="space-y-3">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Theme</h3>
            <button 
              onClick={onChangeTheme}
              className="w-full flex items-center gap-4 bg-gray-800/50 border border-gray-700 rounded-xl p-3 hover:bg-gray-800 hover:border-purple-500/50 transition-all group"
            >
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gradient-to-br from-purple-900/50 to-zinc-800">
                <img 
                  src={selectedTheme.image} 
                  alt={selectedTheme.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-white">{selectedTheme.name}</p>
                <p className="text-xs text-gray-500">{selectedTheme.cards.length} cards</p>
              </div>
              <div className="text-gray-500 group-hover:text-purple-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
            </button>
        </div>

        {/* Team Configuration */}
        <div className="space-y-4 pt-4 border-t border-gray-800">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Teams</h3>
            {teamNames.map((name, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-gray-700`}>
                  {idx + 1}
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => updateName(idx, e.target.value)}
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                  placeholder="Enter Team Name"
                />
                {teamNames.length > 2 && (
                  <button 
                    onClick={() => removeTeam(idx)}
                    className="p-3 text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            
            {teamNames.length < 4 && (
               <Button variant="secondary" fullWidth onClick={addTeam} className="border-2 border-dashed border-gray-600 bg-transparent hover:bg-gray-800">
                 + Add Team
               </Button>
            )}
        </div>

        {/* Timer Configuration */}
        <div className="space-y-2 pt-4 border-t border-gray-800">
             <div className="flex justify-between items-center">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Turn Timer</h3>
                <span className="text-sm text-purple-400 font-bold">
                    {timerDuration === 0 ? 'Disabled' : `${timerDuration}s`}
                </span>
             </div>
             <p className="text-xs text-gray-500 mb-2">Set the time limit for clues and guesses. Set to 0 to disable.</p>
             <input 
                type="range" 
                min="0" 
                max="180" 
                step="10" 
                value={timerDuration}
                onChange={(e) => setTimerDuration(Number(e.target.value))}
                className="w-full accent-purple-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
             />
             <div className="flex justify-between text-xs text-gray-600 font-mono">
                <span>Off</span>
                <span>60s</span>
                <span>120s</span>
                <span>180s</span>
             </div>
        </div>
      </div>

      <Button onClick={handleStart} className="w-full max-w-md text-lg py-4 shadow-xl shadow-purple-900/20">
        Start Game
      </Button>
    </div>
  );
};