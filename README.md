# Wordle

A clone of [Wordle](https://www.nytimes.com/games/wordle/index.html). Guess the
hidden five-letter word in six tries; each guess is scored per letter as
correct (green), present but misplaced (yellow), or absent (grey).

Built with Bun, Vite, React 19 and TypeScript. The only runtime dependencies are
`react` and `react-dom` — the keyboard, toasts, modals, icons and styling are all
first-party.

## Requirements

- [Bun](https://bun.sh) 1.3+

## Getting started

```bash
bun install
```

```bash
bun run dev
```

Opens the dev server with hot module replacement at http://localhost:3000.

### Other scripts

| Script | What it does |
| --- | --- |
| `bun run dev` | Dev server with HMR |
| `bun test` | Unit tests (Bun's built-in runner) |
| `bun run typecheck` | Type-check without emitting |
| `bun run build` | Type-check, then bundle to `dist/` |
| `bun run preview` | Serve `dist/` locally |
| `bun run words` | Regenerate the bundled word lists |
| `bun run deploy` | Build and publish `dist/` to `gh-pages` |

## Features

**Daily puzzle.** Everyone gets the same word on the same day, drawn in the
official Wordle order and rolling over at local midnight. An in-progress game is
saved to `localStorage` and restored on return; a game from a previous day is
discarded.

**Practice mode.** Unlimited random words for when the daily is done. Practice
games never touch your streak or statistics, and starting one leaves your saved
daily game untouched.

**Hard mode.** Any revealed hint must be reused in later guesses. Hints
accumulate across every previous guess, and the setting locks once a game is
underway so it cannot be enabled to retroactively invalidate progress.

**Statistics.** Games played, win rate, current and maximum streak, and a guess
distribution. A streak continues only when consecutive daily puzzles are solved,
and a given puzzle can never be counted twice.

**Sharing.** Produces the familiar spoiler-free emoji grid, using the Web Share
sheet on mobile and the clipboard everywhere else. The grid follows your theme
and high-contrast settings.

**Themes.** Dark and light, plus a high-contrast mode that swaps green/yellow for
orange/blue. The choice is applied before first paint, so there is no flash of
the wrong theme on load.

**Accessibility.** Tiles and keys carry labels describing their state, toasts
announce through a live region, modals use the native `<dialog>` element for
focus trapping and Escape handling, and all animation is disabled under
`prefers-reduced-motion`.

**Responsive.** Tile size is derived in CSS from the viewport, so the board fills
the space between header and keyboard without scrolling — from a 320px phone up
to desktop, including short landscape windows.

## Project layout

```
index.html                 Vite entry point, applies the saved theme pre-paint
vite.config.ts             Build config (React plugin, gh-pages base path)
scripts/
  generate-word-lists.ts   Regenerates src/data from the raw JSON sources
src/
  main.tsx                 React root
  App.tsx                  Wiring: input, reveal timing, persistence, modals
  index.css                Design tokens, layout, components, animations
  game/                    Pure logic — no React
    constants.ts           Word length, guess count, animation timing
    scoring.ts             Guess scoring and keyboard letter aggregation
    words.ts               Dictionary, daily puzzle selection, countdown
    hardMode.ts            Hard-mode hint enforcement
    share.ts               Emoji grid and share/clipboard handling
  state/
    gameReducer.ts         All game transitions, as a pure reducer
    persistence.ts         Saved game and settings
    stats.ts               Streaks and guess distribution
    storage.ts             Guarded localStorage access
  components/              Board, Row, Tile, Keyboard, Modal, Header, modals
  hooks/                   Toasts, countdown
  icons/                   Inline SVG icons
  data/                    answers.txt, dictionary.txt
```

The game logic in `src/game/` and `src/state/` is pure and framework-free, which
is what the test suite covers.

## Word lists

`src/data/answers.txt` (2,315 solutions, in official order) and
`src/data/dictionary.txt` (15,930 accepted guesses) are newline-delimited text
generated from the JSON sources in `src/Asset/`. Plain text rather than a JS
array roughly halves the bytes and parses with a single `split`. Regenerate with:

```bash
bun run words
```

## Deployment

`bun run deploy` builds and pushes `dist/` to the `gh-pages` branch. Production
assets are served from the `/wordle/` base path configured in `vite.config.ts`;
change it if you host at a different path.
