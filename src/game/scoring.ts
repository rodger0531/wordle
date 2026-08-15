import type { LetterState } from "./types";

/**
 * Scores a guess against the answer using Wordle's duplicate-letter rules:
 * exact matches are claimed first, then misplaced letters consume whatever
 * copies of that letter are left over. So guessing SPEED against ERASE marks
 * only one of the two Es.
 */
export function scoreGuess(guess: string, answer: string): LetterState[] {
  const result: LetterState[] = Array<LetterState>(guess.length).fill("absent");
  const unmatched = new Map<string, number>();

  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === answer[i]) {
      result[i] = "correct";
    } else {
      unmatched.set(answer[i]!, (unmatched.get(answer[i]!) ?? 0) + 1);
    }
  }

  for (let i = 0; i < guess.length; i++) {
    if (result[i] === "correct") continue;
    const remaining = unmatched.get(guess[i]!) ?? 0;
    if (remaining > 0) {
      result[i] = "present";
      unmatched.set(guess[i]!, remaining - 1);
    }
  }

  return result;
}

/**
 * Best-known state for each letter across every guess so far, used to colour
 * the on-screen keyboard. A letter never regresses: once it is `correct` a
 * later `absent` cannot dim it.
 */
export function aggregateLetterStates(
  guesses: string[],
  answer: string
): Map<string, LetterState> {
  const rank: Record<LetterState, number> = { absent: 0, present: 1, correct: 2 };
  const states = new Map<string, LetterState>();

  for (const guess of guesses) {
    const scored = scoreGuess(guess, answer);
    scored.forEach((state, i) => {
      const letter = guess[i]!;
      const existing = states.get(letter);
      if (!existing || rank[state] > rank[existing]) {
        states.set(letter, state);
      }
    });
  }

  return states;
}
