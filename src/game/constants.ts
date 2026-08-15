export const WORD_LENGTH = 5;
export const MAX_GUESSES = 6;

/** Duration of a single tile's flip, and the delay between adjacent tiles. */
export const FLIP_DURATION_MS = 500;
export const FLIP_STAGGER_MS = 300;

/** How long a full row takes to finish revealing. */
export const REVEAL_DURATION_MS =
  FLIP_STAGGER_MS * (WORD_LENGTH - 1) + FLIP_DURATION_MS;

export const SHAKE_DURATION_MS = 600;
export const TOAST_DURATION_MS = 1600;
