import { describe, expect, it } from "bun:test";
import { aggregateLetterStates, scoreGuess } from "../scoring";

describe("scoreGuess", () => {
  it("marks an exact match all correct", () => {
    expect(scoreGuess("STAIN", "STAIN")).toEqual([
      "correct",
      "correct",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("marks a guess sharing no letters all absent", () => {
    expect(scoreGuess("BEAST", "ROCKY")).toEqual([
      "absent",
      "absent",
      "absent",
      "absent",
      "absent",
    ]);
  });

  it("marks misplaced letters present", () => {
    expect(scoreGuess("STONE", "ALONE")).toEqual([
      "absent",
      "absent",
      "correct",
      "correct",
      "correct",
    ]);
  });

  it("only credits as many duplicates as the answer holds", () => {
    // ATLAS has two As; the first S is exact, so the trailing A stays absent.
    expect(scoreGuess("STATS", "ATLAS")).toEqual([
      "absent",
      "correct",
      "present",
      "absent",
      "correct",
    ]);
  });

  it("credits both duplicates when the answer holds two", () => {
    // ERASE has two Es, so neither E in SPEED is wasted.
    expect(scoreGuess("SPEED", "ERASE")).toEqual([
      "present",
      "absent",
      "present",
      "present",
      "absent",
    ]);
  });

  it("credits only one duplicate when the answer holds one", () => {
    // ABIDE has a single E; the second E in SPEED goes unmatched.
    expect(scoreGuess("SPEED", "ABIDE")).toEqual([
      "absent",
      "absent",
      "present",
      "absent",
      "present",
    ]);
  });

  it("handles a full transposition", () => {
    expect(scoreGuess("TASAT", "STATA")).toEqual([
      "present",
      "present",
      "present",
      "present",
      "present",
    ]);
  });

  it("scores partial overlaps", () => {
    expect(scoreGuess("PARTY", "STAIN")).toEqual([
      "absent",
      "present",
      "absent",
      "present",
      "absent",
    ]);
  });
});

describe("aggregateLetterStates", () => {
  it("keeps the best state seen for a letter", () => {
    // T is present in the first guess and correct in the second.
    const states = aggregateLetterStates(["TRACE", "STONE"], "STONE");
    expect(states.get("T")).toBe("correct");
  });

  it("never downgrades a correct letter to absent", () => {
    const states = aggregateLetterStates(["SPARE", "CRUST"], "SPARE");
    expect(states.get("S")).toBe("correct");
  });

  it("records absent letters", () => {
    const states = aggregateLetterStates(["BEAST"], "ROCKY");
    expect(states.get("B")).toBe("absent");
    expect(states.get("E")).toBe("absent");
  });

  it("returns an empty map when nothing has been guessed", () => {
    expect(aggregateLetterStates([], "STONE").size).toBe(0);
  });
});
