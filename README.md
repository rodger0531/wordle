# Wordle

A clone of [Wordle](https://www.nytimes.com/games/wordle/index.html). Guess the
hidden five-letter word in six tries; each guess is scored per letter as
correct (green), present but misplaced (yellow), or absent.

Built with Bun, Vite, React 19, TypeScript and Tailwind CSS v4.

## Requirements

- [Bun](https://bun.sh) 1.3+

## Getting started

```bash
bun install
```

### `bun run dev`

Starts the Vite dev server with hot module replacement at
[http://localhost:3000](http://localhost:3000).

### `bun test`

Runs the unit tests with Bun's built-in test runner.

### `bun run typecheck`

Type-checks the project without emitting output.

### `bun run build`

Type-checks, then builds the production bundle into `dist/`. Assets are
prefixed with the `/wordle/` base path used by GitHub Pages.

### `bun run preview`

Serves the contents of `dist/` locally to sanity-check a production build.

### `bun run deploy`

Builds and publishes `dist/` to the `gh-pages` branch.

## Word lists

`src/Asset/list.js` and `src/Asset/indexedList.js` are generated from the raw
JSON sources in `src/Asset/`. `indexedList` buckets words by first letter so
guess validation only scans one bucket. Regenerate them with:

```bash
bun run words
```

## Project layout

```
index.html                 Vite entry point
vite.config.ts             Build config (React + Tailwind plugins, gh-pages base)
scripts/
  generate-word-lists.ts   Regenerates the bundled word lists
src/
  index.tsx                React root
  App.tsx                  Game state and keyboard handling
  components/              Board, GameRow, GameTile, VirtualKeyboard
  constants/               Game constants and keyboard layout
  utils/                   Guess scoring, keyboard colouring, helpers
  Asset/                   Word lists
```
