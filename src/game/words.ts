import answersRaw from "../data/answers.txt?raw";
import dictionaryRaw from "../data/dictionary.txt?raw";

/** Solutions in official Wordle order, so puzzle N matches everyone else's. */
export const ANSWERS: string[] = answersRaw.split("\n");

/** Every word accepted as a guess. A Set keeps validation O(1). */
const DICTIONARY = new Set(dictionaryRaw.split("\n"));

/** Wordle's day zero. Local midnight, so the puzzle rolls over at the
 * player's midnight rather than UTC's. */
const EPOCH = new Date(2021, 5, 19);

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const DAY_MS = 86_400_000;

export function isValidWord(word: string): boolean {
  return DICTIONARY.has(word.toLowerCase());
}

/** Sequential puzzle number for a given day. */
export function puzzleNumberForDate(date: Date = new Date()): number {
  const days = (startOfDay(date).getTime() - EPOCH.getTime()) / DAY_MS;
  return Math.max(0, Math.round(days));
}

export function answerForPuzzle(puzzleNumber: number): string {
  return ANSWERS[puzzleNumber % ANSWERS.length]!.toUpperCase();
}

export function randomAnswer(): string {
  return ANSWERS[Math.floor(Math.random() * ANSWERS.length)]!.toUpperCase();
}

/** Milliseconds until the next daily puzzle unlocks. */
export function msUntilNextPuzzle(now: Date = new Date()): number {
  const tomorrow = startOfDay(now).getTime() + DAY_MS;
  return tomorrow - now.getTime();
}
