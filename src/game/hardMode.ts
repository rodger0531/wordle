import { scoreGuess } from "./scoring";

const ORDINALS = ["1st", "2nd", "3rd", "4th", "5th", "6th"];

/**
 * Hard mode requires every revealed hint to be reused. Hints accumulate across
 * all previous guesses, so a letter shown to be present in guess 1 is still
 * mandatory in guess 4.
 *
 * Returns an error message, or null when the guess is allowed.
 */
export function checkHardMode(
  guess: string,
  previousGuesses: string[],
  answer: string
): string | null {
  /** Position -> letter that must sit there, from every green seen so far. */
  const fixedPositions = new Map<number, string>();
  /** Letter -> fewest copies the guess must contain. */
  const minimumCounts = new Map<string, number>();

  for (const previous of previousGuesses) {
    const scored = scoreGuess(previous, answer);
    const countsInGuess = new Map<string, number>();

    scored.forEach((state, index) => {
      const letter = previous[index]!;
      if (state === "correct") fixedPositions.set(index, letter);
      if (state === "correct" || state === "present") {
        countsInGuess.set(letter, (countsInGuess.get(letter) ?? 0) + 1);
      }
    });

    for (const [letter, count] of countsInGuess) {
      minimumCounts.set(letter, Math.max(minimumCounts.get(letter) ?? 0, count));
    }
  }

  for (const [index, letter] of [...fixedPositions].sort((a, b) => a[0] - b[0])) {
    if (guess[index] !== letter) {
      return `${ORDINALS[index]} letter must be ${letter}`;
    }
  }

  for (const [letter, required] of minimumCounts) {
    const present = [...guess].filter((c) => c === letter).length;
    if (present < required) {
      return `Guess must contain ${letter}`;
    }
  }

  return null;
}
