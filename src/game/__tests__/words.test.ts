import { describe, expect, it } from "bun:test";
import {
  ANSWERS,
  answerForPuzzle,
  isValidWord,
  msUntilNextPuzzle,
  puzzleNumberForDate,
} from "../words";

describe("dictionary", () => {
  it("accepts real five-letter words", () => {
    expect(isValidWord("stone")).toBe(true);
    expect(isValidWord("crane")).toBe(true);
  });

  it("is case insensitive", () => {
    expect(isValidWord("STONE")).toBe(true);
  });

  it("rejects words that are not in the list", () => {
    expect(isValidWord("zzzzz")).toBe(false);
    expect(isValidWord("qwert")).toBe(false);
  });

  it("accepts every possible answer as a guess", () => {
    // A solution the player cannot type would make the game unwinnable.
    expect(ANSWERS.every(isValidWord)).toBe(true);
  });

  it("contains only five-letter entries", () => {
    expect(ANSWERS.every((word) => word.length === 5)).toBe(true);
  });
});

describe("puzzleNumberForDate", () => {
  it("is stable for a given day", () => {
    const morning = new Date(2026, 7, 15, 8, 0, 0);
    const evening = new Date(2026, 7, 15, 23, 59, 0);
    expect(puzzleNumberForDate(morning)).toBe(puzzleNumberForDate(evening));
  });

  it("advances by one each day", () => {
    const today = new Date(2026, 7, 15, 12, 0, 0);
    const tomorrow = new Date(2026, 7, 16, 12, 0, 0);
    expect(puzzleNumberForDate(tomorrow)).toBe(puzzleNumberForDate(today) + 1);
  });

  it("survives a daylight-saving boundary", () => {
    // US DST ends 2026-11-01; the day before and after must still differ by one.
    const before = new Date(2026, 9, 31, 12, 0, 0);
    const after = new Date(2026, 10, 1, 12, 0, 0);
    expect(puzzleNumberForDate(after)).toBe(puzzleNumberForDate(before) + 1);
  });

  it("starts at zero on the epoch date", () => {
    expect(puzzleNumberForDate(new Date(2021, 5, 19, 9, 0, 0))).toBe(0);
  });
});

describe("answerForPuzzle", () => {
  it("is deterministic", () => {
    expect(answerForPuzzle(42)).toBe(answerForPuzzle(42));
  });

  it("returns an uppercase word from the answer list", () => {
    const answer = answerForPuzzle(42);
    expect(answer).toBe(answer.toUpperCase());
    expect(ANSWERS).toContain(answer.toLowerCase());
  });

  it("wraps around once the list is exhausted", () => {
    expect(answerForPuzzle(ANSWERS.length)).toBe(answerForPuzzle(0));
  });
});

describe("msUntilNextPuzzle", () => {
  it("counts down to the next local midnight", () => {
    const remaining = msUntilNextPuzzle(new Date(2026, 7, 15, 23, 0, 0));
    expect(remaining).toBe(60 * 60 * 1000);
  });

  it("is always within a day", () => {
    const remaining = msUntilNextPuzzle(new Date(2026, 7, 15, 0, 0, 1));
    expect(remaining).toBeGreaterThan(0);
    expect(remaining).toBeLessThanOrEqual(86_400_000);
  });
});
