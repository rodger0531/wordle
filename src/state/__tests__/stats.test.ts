import { describe, expect, it } from "bun:test";
import { emptyStats, recordResult } from "../stats";

describe("recordResult", () => {
  it("counts a win and starts a streak", () => {
    const stats = recordResult(emptyStats(), {
      won: true,
      guessCount: 3,
      puzzleNumber: 10,
    });

    expect(stats.played).toBe(1);
    expect(stats.wins).toBe(1);
    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
    expect(stats.distribution[2]).toBe(1);
  });

  it("continues the streak on consecutive puzzles", () => {
    let stats = recordResult(emptyStats(), {
      won: true,
      guessCount: 3,
      puzzleNumber: 10,
    });
    stats = recordResult(stats, { won: true, guessCount: 4, puzzleNumber: 11 });

    expect(stats.currentStreak).toBe(2);
    expect(stats.maxStreak).toBe(2);
  });

  it("restarts the streak after a skipped day", () => {
    let stats = recordResult(emptyStats(), {
      won: true,
      guessCount: 3,
      puzzleNumber: 10,
    });
    stats = recordResult(stats, { won: true, guessCount: 3, puzzleNumber: 15 });

    expect(stats.currentStreak).toBe(1);
    expect(stats.maxStreak).toBe(1);
  });

  it("zeroes the streak on a loss but keeps the maximum", () => {
    let stats = recordResult(emptyStats(), {
      won: true,
      guessCount: 2,
      puzzleNumber: 10,
    });
    stats = recordResult(stats, { won: false, guessCount: 6, puzzleNumber: 11 });

    expect(stats.currentStreak).toBe(0);
    expect(stats.maxStreak).toBe(1);
    expect(stats.played).toBe(2);
    expect(stats.wins).toBe(1);
  });

  it("does not add a loss to the distribution", () => {
    const stats = recordResult(emptyStats(), {
      won: false,
      guessCount: 6,
      puzzleNumber: 10,
    });
    expect(stats.distribution.every((count) => count === 0)).toBe(true);
  });

  it("ignores a puzzle that was already recorded", () => {
    const first = recordResult(emptyStats(), {
      won: true,
      guessCount: 3,
      puzzleNumber: 10,
    });
    const again = recordResult(first, {
      won: true,
      guessCount: 3,
      puzzleNumber: 10,
    });

    expect(again).toBe(first);
    expect(again.played).toBe(1);
  });

  it("tracks the best streak across a dip", () => {
    let stats = emptyStats();
    for (const puzzleNumber of [1, 2, 3]) {
      stats = recordResult(stats, { won: true, guessCount: 4, puzzleNumber });
    }
    stats = recordResult(stats, { won: false, guessCount: 6, puzzleNumber: 4 });
    stats = recordResult(stats, { won: true, guessCount: 4, puzzleNumber: 5 });

    expect(stats.maxStreak).toBe(3);
    expect(stats.currentStreak).toBe(1);
  });
});
