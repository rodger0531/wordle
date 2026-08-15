import { describe, expect, it } from "bun:test";
import { checkHardMode } from "../hardMode";

describe("checkHardMode", () => {
  const answer = "STONE";

  it("allows any guess when nothing has been revealed", () => {
    expect(checkHardMode("CRANE", [], answer)).toBeNull();
  });

  it("requires a revealed green to stay in its position", () => {
    // ALONE reveals O, N and E; SPORE moves them.
    expect(checkHardMode("SPORE", ["ALONE"], answer)).toBe(
      "4th letter must be N"
    );
  });

  it("requires a revealed yellow letter to be reused", () => {
    // TRIAD reveals T as present; BLUSH drops it.
    expect(checkHardMode("BLUSH", ["TRIAD"], answer)).toBe(
      "Guess must contain T"
    );
  });

  it("accepts a guess that honours every hint", () => {
    expect(checkHardMode("STONE", ["ALONE"], answer)).toBeNull();
  });

  it("accumulates hints across several guesses", () => {
    // ALONE fixes O/N/E; TRIAD adds T. Only a guess with all four passes.
    expect(checkHardMode("PHONE", ["ALONE", "TRIAD"], answer)).toBe(
      "Guess must contain T"
    );
    expect(checkHardMode("STONE", ["ALONE", "TRIAD"], answer)).toBeNull();
  });

  it("reports the earliest mismatched position first", () => {
    expect(checkHardMode("CRANE", ["STONE"], "STONE")).toBe(
      "1st letter must be S"
    );
  });

  it("enforces the number of copies a letter must appear", () => {
    // ERASE against SPEED shows two Es; a guess with one E is not enough.
    expect(checkHardMode("THEIR", ["ERASE"], "SPEED")).toBe(
      "Guess must contain E"
    );
  });
});
