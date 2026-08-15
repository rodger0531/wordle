/** Result of scoring one letter of a guess. */
export type LetterState = "correct" | "present" | "absent";

/** Visual state of a board tile, including states a scored letter never has. */
export type TileState = LetterState | "empty" | "filled";

export type GameStatus = "playing" | "won" | "lost";

/** `daily` is the shared puzzle of the day; `practice` is unlimited random. */
export type GameMode = "daily" | "practice";

export type Theme = "dark" | "light";
