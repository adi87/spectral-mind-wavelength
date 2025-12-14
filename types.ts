export type Team = {
  id: string;
  name: string;
  score: number;
};

export type SpectrumCard = {
  left: string;
  right: string;
};

export enum GamePhase {
  INTRO = 'INTRO',
  THEME_SELECT = 'THEME_SELECT',
  SETUP = 'SETUP',
  TURN_START = 'TURN_START',
  PSYCHIC_VIEW = 'PSYCHIC_VIEW', // Psychic sees target, gives clue
  GUESSING = 'GUESSING', // Team moves dial, target hidden
  REVEAL = 'REVEAL', // Target shown, points awarded
  GAME_OVER = 'GAME_OVER',
}

export type TurnState = {
  activeTeamIndex: number;
  spectrum: SpectrumCard | null;
  targetValue: number; // 0 to 100
  guessValue: number; // 0 to 100
  clue: string;
  roundScore: number;
};
