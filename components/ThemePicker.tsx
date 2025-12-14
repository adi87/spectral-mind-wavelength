import React, { useState } from 'react';
import { THEMES, Theme } from '../services/spectrumService/themes';

interface ThemePickerProps {
  onSelectTheme: (theme: Theme) => void;
}

export const ThemePicker: React.FC<ThemePickerProps> = ({ onSelectTheme }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleSelect = (theme: Theme, index: number) => {
    setSelectedIndex(index);
    // Small delay for visual feedback before transitioning
    setTimeout(() => {
      onSelectTheme(theme);
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[80vh] animate-fade-in p-4 pb-12">
      {/* Header */}
      <div className="text-center space-y-3 mb-8 mt-4">
        <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400">
          Choose Your Vibe
        </h1>
        <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto">
          Pick a theme to set the mood for your game
        </p>
      </div>

      {/* Theme Grid */}
      <div className="w-full max-w-4xl grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
        {THEMES.map((theme, index) => {
          const isSelected = selectedIndex === index;
          
          return (
            <button
              key={theme.name}
              onClick={() => handleSelect(theme, index)}
              className={`
                relative aspect-[4/5] rounded-2xl overflow-hidden
                transition-all duration-200 ease-out
                ${isSelected ? 'ring-4 ring-purple-500 scale-95 opacity-90' : 'active:scale-95'}
                focus:outline-none focus:ring-4 focus:ring-purple-500/50
              `}
            >
              {/* Background Image */}
              <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
                <img
                  src={theme.image}
                  alt={theme.name}
                  className="h-full w-auto object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>

              {/* Selection Checkmark */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <svg 
                    className="w-5 h-5 text-white" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={3} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Subtle instruction */}
      <p className="text-gray-600 text-xs mt-8 animate-pulse">
        Tap a theme to continue
      </p>
    </div>
  );
};
