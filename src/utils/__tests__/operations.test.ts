import { isAllowedKey, processGuess } from "../operations";

describe("isAllowedKey test", () => {
  it("Key should return true", () => {
    expect(isAllowedKey("Key")).toBe(true);
  });
  it("Enter should return true", () => {
    expect(isAllowedKey("Enter")).toBe(true);
  });
  it("Backspace should return true", () => {
    expect(isAllowedKey("Backspace")).toBe(true);
  });
  it("Key1 should return true", () => {
    expect(isAllowedKey("Key1")).toBe(true);
  });
  it("1Enter should return false", () => {
    expect(isAllowedKey("1Enter")).toBe(false);
  });
  it("Backspace1 should return false", () => {
    expect(isAllowedKey("Backspace1")).toBe(false);
  });
});

test("processGuess", () => {
  expect(processGuess("TESTS", "BESTS")).toEqual([0, 2, 2, 2, 2]);
  expect(processGuess("PARTY", "STAIN")).toEqual([0, 1, 0, 1, 0]);
  expect(processGuess("STONE", "ALONE")).toEqual([0, 0, 2, 2, 2]);
  expect(processGuess("STATS", "ATLAS")).toEqual([0, 2, 1, 0, 2]);
  expect(processGuess("BEAST", "ROCKY")).toEqual([0, 0, 0, 0, 0]);
  expect(processGuess("TASAT", "STATA")).toEqual([1, 1, 1, 1, 1]);
  expect(processGuess("STAIN", "STAIN")).toEqual([2, 2, 2, 2, 2]);
});
