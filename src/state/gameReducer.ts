import { MAX_GUESSES, WORD_LENGTH } from "../game/constants";
import { checkHardMode } from "../game/hardMode";
import type { GameMode, GameStatus } from "../game/types";
import {
  answerForPuzzle,
  isValidWord,
  puzzleNumberForDate,
  randomAnswer,
} from "../game/words";

/** Practice games have no shared puzzle identity. */
export const PRACTICE_PUZZLE = -1;

export interface GameState {
  mode: GameMode;
  puzzleNumber: number;
  answer: string;
  guesses: string[];
  current: string;
  status: GameStatus;
  /**
   * Rows whose flip animation has finished. Lags `guesses.length` while a row
   * is revealing, which is what gates keyboard colours, the win bounce and
   * further input.
   */
  revealedRows: number;
  hardMode: boolean;
  /** Nonce lets the UI re-trigger a toast/shake for the same message twice. */
  error: { message: string; nonce: number } | null;
}

export type GameAction =
  | { type: "addLetter"; letter: string }
  | { type: "deleteLetter" }
  | { type: "submit" }
  | { type: "revealComplete" }
  | { type: "newGame"; mode: GameMode }
  | { type: "setHardMode"; value: boolean }
  | { type: "restore"; state: GameState };

export function createGame(mode: GameMode, hardMode: boolean): GameState {
  const isDaily = mode === "daily";
  const puzzleNumber = isDaily ? puzzleNumberForDate() : PRACTICE_PUZZLE;

  return {
    mode,
    puzzleNumber,
    answer: isDaily ? answerForPuzzle(puzzleNumber) : randomAnswer(),
    guesses: [],
    current: "",
    status: "playing",
    revealedRows: 0,
    hardMode,
    error: null,
  };
}

/** True while a row is mid-flip — input must be ignored until it settles. */
export const isRevealing = (state: GameState): boolean =>
  state.guesses.length > state.revealedRows;

export const acceptsInput = (state: GameState): boolean =>
  state.status === "playing" && !isRevealing(state);

const withError = (state: GameState, message: string): GameState => ({
  ...state,
  error: { message, nonce: (state.error?.nonce ?? 0) + 1 },
});

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "addLetter": {
      if (!acceptsInput(state) || state.current.length >= WORD_LENGTH) {
        return state;
      }
      return { ...state, current: state.current + action.letter, error: null };
    }

    case "deleteLetter": {
      if (!acceptsInput(state) || state.current.length === 0) return state;
      return { ...state, current: state.current.slice(0, -1), error: null };
    }

    case "submit": {
      if (!acceptsInput(state)) return state;

      if (state.current.length < WORD_LENGTH) {
        return withError(state, "Not enough letters");
      }
      if (!isValidWord(state.current)) {
        return withError(state, "Not in word list");
      }
      if (state.hardMode) {
        const violation = checkHardMode(
          state.current,
          state.guesses,
          state.answer
        );
        if (violation) return withError(state, violation);
      }

      return {
        ...state,
        guesses: [...state.guesses, state.current],
        current: "",
        error: null,
      };
    }

    case "revealComplete": {
      if (!isRevealing(state)) return state;

      const revealedRows = state.guesses.length;
      const solved = state.guesses[revealedRows - 1] === state.answer;
      const status: GameStatus = solved
        ? "won"
        : revealedRows >= MAX_GUESSES
          ? "lost"
          : "playing";

      return { ...state, revealedRows, status };
    }

    case "newGame":
      return createGame(action.mode, state.hardMode);

    case "setHardMode": {
      // Locked mid-game so hints already given cannot be retroactively required.
      if (state.status === "playing" && state.guesses.length > 0) {
        return withError(state, "Hard mode can only change at the start");
      }
      return { ...state, hardMode: action.value };
    }

    case "restore":
      return action.state;
  }
}
