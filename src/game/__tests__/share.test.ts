import { describe, expect, it } from "bun:test";
import { buildShareText } from "../share";

const base = {
  puzzleNumber: 1234,
  answer: "STONE",
  guesses: ["ALONE", "STONE"],
  won: true,
  hardMode: false,
  theme: "dark" as const,
  highContrast: false,
};

describe("buildShareText", () => {
  it("renders the header and emoji grid", () => {
    expect(buildShareText(base)).toBe(
      "Wordle 1234 2/6\n\n⬛⬛🟩🟩🟩\n🟩🟩🟩🟩🟩"
    );
  });

  it("marks a loss with X", () => {
    const text = buildShareText({
      ...base,
      won: false,
      guesses: ["ALONE"],
    });
    expect(text.startsWith("Wordle 1234 X/6")).toBe(true);
  });

  it("appends an asterisk in hard mode", () => {
    const text = buildShareText({ ...base, hardMode: true });
    expect(text.startsWith("Wordle 1234 2/6*")).toBe(true);
  });

  it("uses white squares on the light theme", () => {
    const text = buildShareText({ ...base, theme: "light" });
    expect(text).toContain("⬜⬜🟩🟩🟩");
  });

  it("uses orange and blue in high contrast", () => {
    const text = buildShareText({
      ...base,
      guesses: ["TRAIN"],
      won: false,
      highContrast: true,
    });
    // T and N are present in STONE but misplaced in TRAIN.
    expect(text).toContain("🟦");
    expect(text).not.toContain("🟨");
  });

  it("emits one grid line per guess", () => {
    const lines = buildShareText(base).split("\n");
    expect(lines).toHaveLength(4); // header, blank, two rows
  });
});
