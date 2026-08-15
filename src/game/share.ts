import { MAX_GUESSES } from "./constants";
import { scoreGuess } from "./scoring";
import type { LetterState, Theme } from "./types";

interface ShareOptions {
  puzzleNumber: number;
  guesses: string[];
  answer: string;
  won: boolean;
  hardMode: boolean;
  theme: Theme;
  highContrast: boolean;
}

const emojiFor = (
  state: LetterState,
  theme: Theme,
  highContrast: boolean
): string => {
  if (state === "correct") return highContrast ? "🟧" : "🟩";
  if (state === "present") return highContrast ? "🟦" : "🟨";
  return theme === "light" ? "⬜" : "⬛";
};

/** Builds the spoiler-free emoji grid players paste into chats. */
export function buildShareText({
  puzzleNumber,
  guesses,
  answer,
  won,
  hardMode,
  theme,
  highContrast,
}: ShareOptions): string {
  const score = won ? `${guesses.length}/${MAX_GUESSES}` : `X/${MAX_GUESSES}`;
  const header = `Wordle ${puzzleNumber} ${score}${hardMode ? "*" : ""}`;

  const grid = guesses
    .map((guess) =>
      scoreGuess(guess, answer)
        .map((state) => emojiFor(state, theme, highContrast))
        .join("")
    )
    .join("\n");

  return `${header}\n\n${grid}`;
}

/**
 * Copies text to the clipboard, falling back to the Web Share sheet on mobile
 * where it is the more natural affordance. Resolves to how it was shared.
 */
export async function shareText(text: string): Promise<"shared" | "copied"> {
  const canShare =
    typeof navigator.share === "function" &&
    // Desktop Chrome exposes share() but often has no target; prefer clipboard.
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  if (canShare) {
    try {
      await navigator.share({ text });
      return "shared";
    } catch (error) {
      // User dismissed the sheet, or sharing is unavailable; fall through.
      if (error instanceof DOMException && error.name === "AbortError") {
        throw error;
      }
    }
  }

  await navigator.clipboard.writeText(text);
  return "copied";
}
