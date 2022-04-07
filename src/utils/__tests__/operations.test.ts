import { isAllowedKey } from "../operations";

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
