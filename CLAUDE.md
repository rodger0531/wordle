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
bun run deploy       # build, then publish dist/ to the gh-pages branch
```

Run a single test file or a single test by name:

```bash
bun test src/game/__tests__/scoring.test.ts
bun test -t "credits both duplicates"
```

`bun test` does **not** typecheck. Run `bun run typecheck` separately, or
`bun run build`, which does both. There is no CI workflow in this repo, so those
two commands are the whole gate — run them before committing.

`.claude/launch.json` defines `wordle-dev` (port 3000) and `wordle-preview`
(port 4173).

## Repository map

```
index.html                 Vite entry; inline script applies theme pre-paint
vite.config.ts             React plugin, dev port 3000, gh-pages base path
scripts/
  generate-word-lists.ts   Regenerates src/data/ from the raw JSON sources
src/
  main.tsx                 React root; mounts StrictMode + ToastProvider
  App.tsx                  Wiring: input, reveal timing, persistence, modals
  index.css                Design tokens, layout, components, animations
  game/                    Pure logic — no React
    constants.ts           Word length, guess count, animation timing
    types.ts               LetterState, TileState, GameStatus, GameMode, Theme
    scoring.ts             Guess scoring and keyboard letter aggregation
    words.ts               Dictionary, daily puzzle selection, countdown
    hardMode.ts            Hard-mode hint enforcement
    share.ts               Emoji grid and share/clipboard handling
  state/                   Pure state — no React
    gameReducer.ts         All game transitions, as a pure reducer
    persistence.ts         Saved game and settings
    stats.ts               Streaks and guess distribution
    storage.ts             Guarded localStorage access
  components/              Board, Row, Tile, Keyboard, Modal, Header, 3 modals
  hooks/                   useToast (context + provider), useCountdown
  icons/                   Inline SVG icons
  data/                    answers.txt, dictionary.txt (both generated)
  Asset/                   Raw JSON word sources (inputs to `bun run words`)
```

## Architecture

React 19 + TypeScript 7 + Vite 8. The only runtime dependencies are `react` and
`react-dom`; the keyboard, toasts, modals, icons and all styling are first-party.
`src/index.css` is plain CSS with design tokens — there is no Tailwind or CSS-in-JS.

`src/game/` and `src/state/` are pure and framework-free. That is where the logic
lives and what the test suite covers. Components under `src/components/` are thin
and presentational. Keep new logic on the pure side.

Data flows one way: `App` holds the `useReducer` game state plus settings and
stats, and passes them down. Nothing below `App` owns game state.

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

A restored game is never mid-reveal: `loadGame` collapses `revealedRows` to
`guesses.length` on the way in.

### Animation timing is duplicated in TS and CSS — keep them in sync

`src/game/constants.ts` and `src/index.css` hold the same numbers. If they drift,
input unlocks mid-flip or colours appear before the tile turns.

| constants.ts | index.css |
| --- | --- |
| `FLIP_DURATION_MS = 500` | `--flip-duration: 500ms` |
| `FLIP_STAGGER_MS = 300` | `--flip-stagger: 300ms` |
| `SHAKE_DURATION_MS = 600` | `.row[data-shake]` animation `600ms` |

`REVEAL_DURATION_MS` is derived from the first two. `TOAST_DURATION_MS = 1600`
has no CSS counterpart — `useToast` owns the dismissal timer.

Two timings are **not** in `constants.ts`: the delays before the stats modal
opens (1900ms after a win, 1400ms after a loss) are literals in `App.tsx`, sized
to let the bounce finish. Look there, not in `constants.ts`, when tuning them.

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

`.tile[data-animation="flip"]` has the same specificity as the `data-state`
rules, so it wins only because it is written after them. Do not reorder those
blocks.

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

`puzzleNumberForDate` rounds the day count rather than flooring it, because a
DST transition makes a local day 23 or 25 hours long and the division inexact.
`answerForPuzzle` indexes with `% ANSWERS.length`, so the list wraps and repeats
rather than running out.

## Conventions

### TypeScript

`verbatimModuleSyntax` is on, so **type-only imports must use `import type`**
(or inline `type` specifiers) or the build fails. This is the most common way new
code breaks here:

```ts
import type { LetterState } from "./types";
import Tile, { type TileAnimation } from "./Tile";
```

`strict` is on; `noUncheckedIndexedAccess` is not, so the `!` assertions on
indexed access in existing code are defensive style, not a compiler requirement.
`allowImportingTsExtensions` and `isolatedModules` are on. Path aliases are not
configured — imports are relative.

The word lists are loaded through Vite's `?raw` suffix
(`import answersRaw from "../data/answers.txt?raw"`), typed via `vite/client` in
`tsconfig.json`'s `types`.

### Styling

Every colour and dimension is a custom property on `:root`. **Dark is the base
palette** — `:root` alone is the dark theme; `:root[data-theme="light"]` and
`:root[data-contrast="high"]` only override. A new token therefore needs a value
in the base `:root` block, plus a light override if it differs.

Components pick styling through data attributes (`data-state`, `data-animation`,
`data-shake`, `data-wide`, `data-current`), not through conditional class names.
Follow that when adding variants.

`--tile-size` is computed from `--header-height` and `--keyboard-height` so the
board fits between the chrome without scrolling. The short-viewport and
landscape media queries shrink those two tokens. If you change the real height of
the header or keyboard, update the tokens to match or the board will overflow.

### Tests

Tests live in `__tests__/` directories next to the code they cover and import
from `bun:test`. Coverage is `src/game/` and `src/state/` only.

**There is no DOM test environment** — no jsdom, no happy-dom, no
`@testing-library/*`, no preload/setup file. Under `bun test`, `window`,
`document` and `localStorage` are all `undefined` (`navigator` exists, but
without `share` or `clipboard`), so anything reaching for them throws. That rules
out testing components, `storage.ts`, `persistence.ts`'s load/save, and
`shareText` as they stand — note the share tests cover `buildShareText` only.
Either keep new logic pure and test it there (preferred, and the reason the
pure/presentational split exists), or add a DOM environment first and say so.

`useToast` throws outside a `ToastProvider`, which `main.tsx` mounts around
`App` — another reason component tests need real setup, not a bare render.

### Accessibility

Follow the existing patterns when adding UI: tiles carry an `aria-label`
describing letter and state, rows are labelled groups, keys are labelled buttons,
the toaster is a `role="status"` live region, modals are native `<dialog>` (focus
trap and Escape for free), and `prefers-reduced-motion` collapses every animation
to 1ms.

## Gotchas

**`src/data/*.txt` is generated.** Edit the JSON sources in `src/Asset/` and run
`bun run words`; direct edits are overwritten.

**Do not sort `answers.txt`.** Its insertion order is the official Wordle
solution order, and `answerForPuzzle` indexes into it. Reordering changes every
daily puzzle for every player. `dictionary.txt` is sorted and safe to reorder.

**The word list files end without a trailing newline.** `words.ts` parses them
with a bare `.split("\n")`, so a trailing newline would append an empty string to
`ANSWERS` and `DICTIONARY` — making `""` a valid guess and one puzzle answerless.
The generator's `join("\n")` gets this right; an editor that "fixes" the final
newline does not. Current contents: 2,315 answers, 15,930 dictionary words.

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
and would otherwise 404 on assets. Preview is at `http://localhost:4173/wordle/`,
not `/`.

**Physical keys read `event.key`, not `event.code`**, so non-QWERTY layouts work.
The listener is on `window` and returns early while a modal is open. Virtual keys
call `blur()` on click so a following physical Enter does not fire the focused
button and the window handler at once.

**Modals are native `<dialog>`.** `Modal` syncs `open` to `showModal()`/`close()`
via an effect; `onClose` also fires for Escape and backdrop clicks, so state must
be driven through it rather than assumed.

**StrictMode is on**, so effects mount, unmount and remount in dev. Every timer
effect in `App` returns a cleanup — keep new ones idempotent and cancellable.

**Hard mode is locked mid-game.** Both `gameReducer` (`setHardMode`) and `App`
(`toggleHardMode`) refuse the change once a guess has been made; the reducer
guard is the real one, the `App` check exists to toast without dispatching.

## Common tasks

**Add a setting:** extend `Settings` and `defaultSettings` in
`state/persistence.ts`, add a `Toggle` in `components/SettingsModal.tsx`, and
consume it. If it must apply before first paint, add it to the inline script in
`index.html` too, and bump `wordle:settings:v1` if the shape breaks compatibility.

**Change a game rule:** it belongs in `src/game/` or `src/state/gameReducer.ts`,
with tests in the matching `__tests__/`. Components should not need to change.

**Change animation timing:** update `constants.ts` and `index.css` together (see
the table above), and check the stats-modal delays in `App.tsx`.
