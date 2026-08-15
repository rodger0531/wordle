import type { Theme } from "../game/types";
import { puzzleNumberForDate } from "../game/words";
import type { GameState } from "./gameReducer";
import { readJson, removeKey, writeJson } from "./storage";

const GAME_KEY = "wordle:game:v1";
const SETTINGS_KEY = "wordle:settings:v1";

export interface Settings {
  theme: Theme;
  highContrast: boolean;
  hardMode: boolean;
}

export const defaultSettings = (): Settings => ({
  theme: "dark",
  highContrast: false,
  hardMode: false,
});

export function loadSettings(): Settings {
  return { ...defaultSettings(), ...readJson<Partial<Settings>>(SETTINGS_KEY) };
}

export const saveSettings = (settings: Settings): void =>
  writeJson(SETTINGS_KEY, settings);

/**
 * Restores an in-progress daily game. Anything from a previous day is dropped
 * so the player always lands on today's puzzle.
 */
export function loadGame(): GameState | null {
  const stored = readJson<GameState>(GAME_KEY);
  if (!stored || stored.mode !== "daily") return null;

  if (stored.puzzleNumber !== puzzleNumberForDate()) {
    removeKey(GAME_KEY);
    return null;
  }

  // A saved game is never mid-reveal; collapse any interrupted animation.
  return {
    ...stored,
    revealedRows: stored.guesses.length,
    error: null,
  };
}

export function saveGame(state: GameState): void {
  if (state.mode !== "daily") return;
  writeJson(GAME_KEY, { ...state, error: null });
}
