import { MAX_GUESSES } from "../game/constants";
import { readJson, writeJson } from "./storage";

const STATS_KEY = "wordle:stats:v1";

export interface Stats {
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  /** Index 0 counts games solved in one guess. */
  distribution: number[];
  /** Guards against double-counting if a finished game is restored. */
  lastPuzzleRecorded: number | null;
}

export const emptyStats = (): Stats => ({
  played: 0,
  wins: 0,
  currentStreak: 0,
  maxStreak: 0,
  distribution: Array<number>(MAX_GUESSES).fill(0),
  lastPuzzleRecorded: null,
});

export function loadStats(): Stats {
  const stored = readJson<Partial<Stats>>(STATS_KEY);
  if (!stored) return emptyStats();

  // Merge onto defaults so a schema addition never yields undefined fields.
  const base = emptyStats();
  return {
    ...base,
    ...stored,
    distribution:
      stored.distribution?.length === MAX_GUESSES
        ? stored.distribution
        : base.distribution,
  };
}

export const saveStats = (stats: Stats): void => writeJson(STATS_KEY, stats);

interface RecordInput {
  won: boolean;
  guessCount: number;
  puzzleNumber: number;
}

/**
 * Folds a finished daily game into the stats. Returns the same object when the
 * puzzle was already recorded, so callers can skip a redundant write.
 */
export function recordResult(stats: Stats, result: RecordInput): Stats {
  if (stats.lastPuzzleRecorded === result.puzzleNumber) return stats;

  // A streak survives only if yesterday's puzzle was the last one recorded.
  const continuesStreak = stats.lastPuzzleRecorded === result.puzzleNumber - 1;
  const currentStreak = result.won
    ? continuesStreak
      ? stats.currentStreak + 1
      : 1
    : 0;

  const distribution = [...stats.distribution];
  if (result.won) distribution[result.guessCount - 1] += 1;

  return {
    played: stats.played + 1,
    wins: stats.wins + (result.won ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    distribution,
    lastPuzzleRecorded: result.puzzleNumber,
  };
}
