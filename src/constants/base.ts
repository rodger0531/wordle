export enum DigitStyle {
  Present = "present",
  Correct = "correct",
  Empty = "empty",
  Absent = "absent",
}

export enum GameState {
  Playing = "PLAYING",
  Win = "WIN",
  Lost = "LOST",
}

export const ALLOWED_GUESSES = 6;
export const WORD_LENGTH = 5;
