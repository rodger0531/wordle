import { describe, expect, it } from "bun:test";
import { MAX_GUESSES } from "../../game/constants";
import {
  acceptsInput,
  createGame,
  gameReducer,
  isRevealing,
  type GameState,
} from "../gameReducer";

const gameWith = (patch: Partial<GameState> = {}): GameState => ({
  ...createGame("practice", false),
  answer: "STONE",
  ...patch,
});

const type = (state: GameState, word: string): GameState =>
  [...word].reduce(
    (current, letter) => gameReducer(current, { type: "addLetter", letter }),
    state
  );

describe("typing", () => {
  it("appends letters", () => {
    expect(type(gameWith(), "STO").current).toBe("STO");
  });

  it("stops at the word length", () => {
    expect(type(gameWith(), "STONEXY").current).toBe("STONE");
  });

  it("deletes the last letter", () => {
    const state = gameReducer(type(gameWith(), "STO"), { type: "deleteLetter" });
    expect(state.current).toBe("ST");
  });

  it("ignores delete on an empty row", () => {
    const state = gameWith();
    expect(gameReducer(state, { type: "deleteLetter" })).toBe(state);
  });
});

describe("submitting", () => {
  it("rejects a short guess", () => {
    const state = gameReducer(type(gameWith(), "STO"), { type: "submit" });
    expect(state.error?.message).toBe("Not enough letters");
    expect(state.guesses).toHaveLength(0);
  });

  it("rejects a word outside the dictionary", () => {
    const state = gameReducer(type(gameWith(), "ZZZZZ"), { type: "submit" });
    expect(state.error?.message).toBe("Not in word list");
    expect(state.guesses).toHaveLength(0);
  });

  it("accepts a valid guess and clears the row", () => {
    const state = gameReducer(type(gameWith(), "CRANE"), { type: "submit" });
    expect(state.guesses).toEqual(["CRANE"]);
    expect(state.current).toBe("");
    expect(state.error).toBeNull();
  });

  it("bumps the error nonce so repeats re-trigger the UI", () => {
    const first = gameReducer(type(gameWith(), "ZZZZZ"), { type: "submit" });
    const second = gameReducer(first, { type: "submit" });
    expect(second.error?.nonce).toBe(first.error!.nonce + 1);
  });
});

describe("reveal gating", () => {
  it("locks input until the row finishes revealing", () => {
    const submitted = gameReducer(type(gameWith(), "CRANE"), { type: "submit" });
    expect(isRevealing(submitted)).toBe(true);
    expect(acceptsInput(submitted)).toBe(false);
    expect(type(submitted, "S").current).toBe("");
  });

  it("unlocks input once revealed", () => {
    const submitted = gameReducer(type(gameWith(), "CRANE"), { type: "submit" });
    const revealed = gameReducer(submitted, { type: "revealComplete" });
    expect(acceptsInput(revealed)).toBe(true);
    expect(revealed.status).toBe("playing");
  });

  it("wins when the revealed guess matches", () => {
    const submitted = gameReducer(type(gameWith(), "STONE"), { type: "submit" });
    expect(submitted.status).toBe("playing"); // not until the flip finishes
    expect(gameReducer(submitted, { type: "revealComplete" }).status).toBe("won");
  });

  it("loses after the final row is revealed", () => {
    let state = gameWith();
    for (let i = 0; i < MAX_GUESSES; i++) {
      state = gameReducer(type(state, "CRANE"), { type: "submit" });
      state = gameReducer(state, { type: "revealComplete" });
    }
    expect(state.status).toBe("lost");
    expect(acceptsInput(state)).toBe(false);
  });

  it("ignores a stray revealComplete", () => {
    const state = gameWith();
    expect(gameReducer(state, { type: "revealComplete" })).toBe(state);
  });
});

describe("hard mode", () => {
  it("rejects a guess that drops a revealed hint", () => {
    let state = gameWith({ hardMode: true });
    state = gameReducer(type(state, "ALONE"), { type: "submit" });
    state = gameReducer(state, { type: "revealComplete" });

    const rejected = gameReducer(type(state, "TRICK"), { type: "submit" });
    expect(rejected.error?.message).toBe("3rd letter must be O");
    expect(rejected.guesses).toHaveLength(1);
  });

  it("cannot be toggled once a guess is in", () => {
    let state = gameWith();
    state = gameReducer(type(state, "CRANE"), { type: "submit" });
    state = gameReducer(state, { type: "revealComplete" });

    const toggled = gameReducer(state, { type: "setHardMode", value: true });
    expect(toggled.hardMode).toBe(false);
    expect(toggled.error).not.toBeNull();
  });

  it("can be toggled before the first guess", () => {
    const toggled = gameReducer(gameWith(), { type: "setHardMode", value: true });
    expect(toggled.hardMode).toBe(true);
  });
});

describe("createGame", () => {
  it("gives daily games a shared puzzle number and practice games none", () => {
    expect(createGame("daily", false).puzzleNumber).toBeGreaterThanOrEqual(0);
    expect(createGame("practice", false).puzzleNumber).toBe(-1);
  });

  it("starts empty and playable", () => {
    const game = createGame("daily", false);
    expect(game.guesses).toHaveLength(0);
    expect(game.status).toBe("playing");
    expect(acceptsInput(game)).toBe(true);
  });
});
