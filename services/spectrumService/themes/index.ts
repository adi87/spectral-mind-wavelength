import { ABSURD_AND_CHAOTIC_THEME } from './absurd-and-chaotic';
import { AFTER_DARK_BUT_TASTEFUL_THEME } from './after-dark-but-tasteful';
import { GENERAL_THEME } from './general';
import { FOOD_AND_DRINK_THEME } from './food-and-drink';
import { MODERN_LIFE_THEME } from './modern-life';
import { POP_CULTURE_AND_MEDIA_THEME } from './pop-culture-and-media';
import { RELATIONSHIPS_AND_EMOTIONS_THEME } from './relationships-and-emotions';
import { TECH_AND_STARTUPS_THEME } from './tech-and-startups';
import type { SpectrumCard } from '../../../types';

export type Theme = {
  name: string;
  image: string;
  cards: SpectrumCard[];
};

export {
  ABSURD_AND_CHAOTIC_THEME,
  AFTER_DARK_BUT_TASTEFUL_THEME,
  GENERAL_THEME,
  FOOD_AND_DRINK_THEME,
  MODERN_LIFE_THEME,
  POP_CULTURE_AND_MEDIA_THEME,
  RELATIONSHIPS_AND_EMOTIONS_THEME,
  TECH_AND_STARTUPS_THEME,
};

export const THEMES: Theme[] = [
  GENERAL_THEME,
  FOOD_AND_DRINK_THEME,
  POP_CULTURE_AND_MEDIA_THEME,
  RELATIONSHIPS_AND_EMOTIONS_THEME,
  ABSURD_AND_CHAOTIC_THEME,
  AFTER_DARK_BUT_TASTEFUL_THEME,
  MODERN_LIFE_THEME,
  TECH_AND_STARTUPS_THEME,
];
