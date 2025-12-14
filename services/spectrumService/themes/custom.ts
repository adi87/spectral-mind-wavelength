import type { SpectrumCard } from '../../../types';
import type { Theme } from './index';

const STORAGE_KEY = 'spectral-mind-custom-cards';

export const getCustomCards = (): SpectrumCard[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Failed to load custom cards:', e);
  }
  return [];
};

export const saveCustomCards = (cards: SpectrumCard[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards));
  } catch (e) {
    console.error('Failed to save custom cards:', e);
  }
};

export const addCustomCard = (card: SpectrumCard): SpectrumCard[] => {
  const cards = getCustomCards();
  cards.push(card);
  saveCustomCards(cards);
  return cards;
};

export const removeCustomCard = (index: number): SpectrumCard[] => {
  const cards = getCustomCards();
  cards.splice(index, 1);
  saveCustomCards(cards);
  return cards;
};

export const clearCustomCards = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const getCustomTheme = (): Theme => {
  return {
    name: 'Custom',
    image: 'static/themes/custom.png',
    cards: getCustomCards(),
  };
};

export const CUSTOM_THEME: Theme = {
  name: 'Custom',
  image: 'static/themes/custom.png',
  cards: [], // Will be populated dynamically
};
