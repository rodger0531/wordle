# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Runtime and package manager is **Bun** (1.3+). There is no npm lockfile and no
linter configured — do not reach for `bun run lint`.

```bash
bun install
bun run dev          # Vite dev server + HMR on :3000
bun run typecheck    # tsc --noEmit
bun test             # Bun's built-in runner
bun run build        # typecheck, then bundle to dist/
bun run preview      # serve dist/ (at /wordle/, see Base path below)
bun run words        # regenerate src/data/*.txt from src/Asset/*.json
```

Run a single test file or a single test by name:

```bash
bun test src/game/__tests__/scoring.test.ts
bun test -t "credits both duplicates"
```

`bun test` does **not** typecheck. Run `bun run typecheck` separately, or
`bun run build`, which does both.

## Architecture

React 19 + TypeScript 7 + Vite 8. The only runtime dependencies are `react` and
`react-dom`; the keyboard, toasts, modals, icons and all styling are first-party.
`src/index.css` is plain CSS with design tokens — there is no Tailwind or CSS-in-JS.

`src/game/` and `src/state/` are pure and framework-free. That is where the logic
lives and what the test suite covers. Components under `src/components/` are thin
and presentational. Keep new logic on the pure side.

### The reveal gate (most important concept)

`GameState.revealedRows` lags `guesses.length` while a row's flip animation
plays. That lag is the single mechanism behind four behaviours, so changing it
has wide blast radius:

- input is locked (`acceptsInput`) while `isRevealing(state)` is true
- keyboard colours are aggregated from `guesses.slice(0, revealedRows)`, so keys
  stay grey until the row finishes flipping
- `status` becomes `won`/`lost` **only** on the `revealComplete` action, never on
  `submit` — so the win bounce and praise toast fire after the flip, not during
- `Board` picks the `flip` animation for the row where `rowIndex === revealedRows`

`App.tsx` owns the timer that dispatches `revealComplete` after
`REVEAL_DURATION_MS`.

### Animation timing is duplicated in TS and CSS — keep them in sync

`src/game/constants.ts` and `src/index.css` hold the same numbers. If they drift,
input unlocks mid-flip or colours appear before the tile turns.

| constants.ts | index.css |
| --- | --- |
| `FLIP_DURATION_MS = 500` | `--flip-duration: 500ms` |
| `FLIP_STAGGER_MS = 300` | `--flip-stagger: 300ms` |
| `SHAKE_DURATION_MS = 600` | `.row[data-shake]` animation `600ms` |

`REVEAL_DURATION_MS` is derived from the first two.

### How tiles get their colour

`Tile` renders `data-state` (`empty`/`filled`/`correct`/`present`/`absent`) and
`data-animation` (`none`/`flip`/`bounce`). Each `data-state` sets the custom
properties `--tile-bg`, `--tile-brd`, `--tile-fg`; the base `.tile` rule reads
them. The `flip` keyframes reference those same properties and swap them at the
50% mark, while the tile is edge-on, with `animation-fill-mode: backwards` so the
unrevealed look persists through the stagger delay.

This is why a restored game does not replay animations: `Board` gives already-revealed
rows `animation: "none"`, and the colours come from the base rule alone. Adding a
plain `background` to `.tile` outside a state rule would break the flip.

### Derived state is never stored

Guess evaluations and keyboard letter states are computed with `useMemo` in
`Board` and `App` from `(guesses, answer, revealedRows)`. The pre-rewrite version
stored a `displayList` in state and synced it with effects; do not reintroduce
that pattern.

### Errors use a nonce

Rejected guesses set `state.error = { message, nonce }`. `App` watches
`error.nonce` (not the message) so submitting the same invalid word twice
re-triggers the toast and row shake.

### Daily vs practice

Daily games use a deterministic `puzzleNumber` (days since 2021-06-19, local
midnight) and are persisted. Practice games use `puzzleNumber === PRACTICE_PUZZLE`
(`-1`), are never persisted, and never touch stats or streaks — `saveGame` no-ops
for them, and `App` only calls `recordResult` in daily mode. Switching back to
daily restores the saved daily game rather than creating a fresh one.

## Gotchas

**`src/data/*.txt` is generated.** Edit the JSON sources in `src/Asset/` and run
`bun run words`; direct edits are overwritten.

**Do not sort `answers.txt`.** Its insertion order is the official Wordle
solution order, and `answerForPuzzle` indexes into it. Reordering changes every
daily puzzle for every player. `dictionary.txt` is sorted and safe to reorder.

**The theme is applied twice.** An inline script in `index.html` reads
`wordle:settings:v1` and sets `data-theme`/`data-contrast` before first paint to
avoid a flash; `App` sets the same attributes on change. Renaming the settings
key requires updating `index.html` too.

**localStorage keys are versioned** (`wordle:game:v1`, `wordle:stats:v1`,
`wordle:settings:v1`). Bump the suffix on any schema change — `loadStats` merges
onto defaults, but `loadGame` casts, so an incompatible shape would load as-is.

**Base path.** Production and preview serve from `/wordle/` for GitHub Pages, dev
from `/`. `vite.config.ts` keys this off `command === "build" || isPreview`; the
`isPreview` half is required because `vite preview` runs with `command === "serve"`
and would otherwise 404 on assets.

**Physical keys read `event.key`, not `event.code`**, so non-QWERTY layouts work.
The listener is on `window` and returns early while a modal is open. Virtual keys
call `blur()` on click so a following physical Enter does not fire the focused
button and the window handler at once.

**Modals are native `<dialog>`.** `Modal` syncs `open` to `showModal()`/`close()`
via an effect; `onClose` also fires for Escape and backdrop clicks, so state must
be driven through it rather than assumed.
