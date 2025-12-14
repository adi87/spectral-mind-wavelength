import { SpectrumCard } from '../../types';
import { Theme, GENERAL_THEME } from './themes';

let availableIndices: number[] = [];
let activeTheme: Theme = GENERAL_THEME;

const refillDeck = () => {
  availableIndices = Array.from({ length: activeTheme.cards.length }, (_, i) => i);
};

export const setActiveTheme = (theme: Theme) => {
  activeTheme = theme;
  refillDeck();
};

export const getActiveTheme = (): Theme => {
  return activeTheme;
};

export const resetSpectrumRound = () => {
  refillDeck();
};

// Initialize on first import
refillDeck();

export const generateSpectrum = async (): Promise<SpectrumCard> => {
  // Simulate async delay slightly for effect, though not strictly necessary
  // Keeping it async to match the existing interface expected by GameScreen
  return new Promise((resolve) => {
    if (availableIndices.length === 0) {
      refillDeck();
    }

    const indexInDeck = Math.floor(Math.random() * availableIndices.length);
    const cardIndex = availableIndices[indexInDeck];
    availableIndices.splice(indexInDeck, 1);

    resolve(activeTheme.cards[cardIndex]);
  });
};