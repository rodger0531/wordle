import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import HelpModal from "./components/HelpModal";
import Keyboard, { BACKSPACE_KEY, ENTER_KEY } from "./components/Keyboard";
import SettingsModal from "./components/SettingsModal";
import StatsModal from "./components/StatsModal";
import { REVEAL_DURATION_MS, SHAKE_DURATION_MS } from "./game/constants";
import { aggregateLetterStates } from "./game/scoring";
import { buildShareText, shareText } from "./game/share";
import type { GameMode, GameStatus } from "./game/types";
import { useToast } from "./hooks/useToast";
import {
  acceptsInput,
  createGame,
  gameReducer,
  isRevealing,
} from "./state/gameReducer";
import {
  loadGame,
  loadSettings,
  saveGame,
  saveSettings,
  type Settings,
} from "./state/persistence";
import { loadStats, recordResult, saveStats } from "./state/stats";

type ModalName = "help" | "stats" | "settings";

/** Praise keyed by how many guesses it took. */
const WIN_MESSAGES = [
  "Genius",
  "Magnificent",
  "Impressive",
  "Splendid",
  "Great",
  "Phew",
];

const initialGame = () => loadGame() ?? createGame("daily", loadSettings().hardMode);

export default function App() {
  const [settings, setSettings] = useState<Settings>(loadSettings);
  const [game, dispatch] = useReducer(gameReducer, undefined, initialGame);
  const [stats, setStats] = useState(loadStats);
  const [modal, setModal] = useState<ModalName | null>(null);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const { showToast, clearToasts } = useToast();

  /**
   * Status already reflected in the UI. Seeded with the mounted status so a
   * restored finished game does not replay its win toast.
   */
  const announcedStatus = useRef<GameStatus>(game.status);

  // Reflect theme choices on the root element for the CSS variables to pick up.
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = settings.theme;
    root.dataset.contrast = settings.highContrast ? "high" : "normal";
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", settings.theme === "dark" ? "#121213" : "#ffffff");
  }, [settings.theme, settings.highContrast]);

  useEffect(() => saveSettings(settings), [settings]);
  useEffect(() => saveGame(game), [game]);

  // Open help for first-time players, or stats when returning to a finished game.
  useEffect(() => {
    if (game.status !== "playing") setModal("stats");
    else if (stats.played === 0 && game.guesses.length === 0) setModal("help");
    // Mount only: this is about how the player arrives, not later changes.
  }, []);

  // Let the row finish flipping before colours, praise and input unlock.
  useEffect(() => {
    if (!isRevealing(game)) return;
    const timer = setTimeout(
      () => dispatch({ type: "revealComplete" }),
      REVEAL_DURATION_MS
    );
    return () => clearTimeout(timer);
  }, [game.guesses.length, game.revealedRows]);

  // Rejected guesses shake the active row and explain why.
  const errorNonce = game.error?.nonce;
  useEffect(() => {
    if (!game.error) return;
    showToast(game.error.message);
    setShakeRow(game.guesses.length);
    const timer = setTimeout(() => setShakeRow(null), SHAKE_DURATION_MS);
    return () => clearTimeout(timer);
  }, [errorNonce]);

  useEffect(() => {
    if (game.status === "playing" || announcedStatus.current === game.status) {
      return;
    }
    announcedStatus.current = game.status;

    if (game.status === "won") {
      showToast(WIN_MESSAGES[game.guesses.length - 1] ?? "Well played");
    } else {
      showToast(game.answer, { sticky: true });
    }

    if (game.mode === "daily") {
      setStats((current) => {
        const next = recordResult(current, {
          won: game.status === "won",
          guessCount: game.guesses.length,
          puzzleNumber: game.puzzleNumber,
        });
        if (next !== current) saveStats(next);
        return next;
      });
    }

    // Let the bounce play out before the modal covers the board.
    const timer = setTimeout(
      () => setModal("stats"),
      game.status === "won" ? 1900 : 1400
    );
    return () => clearTimeout(timer);
  }, [game.status]);

  const handleKey = useCallback((key: string) => {
    if (key === ENTER_KEY) dispatch({ type: "submit" });
    else if (key === BACKSPACE_KEY) dispatch({ type: "deleteLetter" });
    else dispatch({ type: "addLetter", letter: key });
  }, []);

  // Physical keyboard. Reads `event.key`, so non-QWERTY layouts work.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (modal !== null) return;
      if (event.repeat || event.ctrlKey || event.metaKey || event.altKey) return;

      if (event.key === "Enter") {
        event.preventDefault();
        handleKey(ENTER_KEY);
      } else if (event.key === "Backspace") {
        handleKey(BACKSPACE_KEY);
      } else if (/^[a-z]$/i.test(event.key)) {
        handleKey(event.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleKey, modal]);

  // Keyboard colours follow revealed rows, not submitted ones.
  const letterStates = useMemo(
    () =>
      aggregateLetterStates(
        game.guesses.slice(0, game.revealedRows),
        game.answer
      ),
    [game.guesses, game.revealedRows, game.answer]
  );

  const startGame = useCallback(
    (mode: GameMode) => {
      clearToasts();
      setModal(null);
      const next =
        mode === "daily"
          ? (loadGame() ?? createGame("daily", settings.hardMode))
          : createGame("practice", settings.hardMode);
      announcedStatus.current = next.status;
      dispatch({ type: "restore", state: next });
    },
    [clearToasts, settings.hardMode]
  );

  const handleShare = useCallback(async () => {
    const text = buildShareText({
      puzzleNumber: game.puzzleNumber,
      guesses: game.guesses,
      answer: game.answer,
      won: game.status === "won",
      hardMode: game.hardMode,
      theme: settings.theme,
      highContrast: settings.highContrast,
    });

    try {
      if ((await shareText(text)) === "copied") showToast("Copied to clipboard");
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        showToast("Could not share");
      }
    }
  }, [game, settings, showToast]);

  const toggleHardMode = useCallback(
    (value: boolean) => {
      if (game.status === "playing" && game.guesses.length > 0) {
        showToast("Hard mode can only change at the start");
        return;
      }
      dispatch({ type: "setHardMode", value });
      setSettings((current) => ({ ...current, hardMode: value }));
    },
    [game.status, game.guesses.length, showToast]
  );

  const closeModal = useCallback(() => setModal(null), []);

  return (
    <div className="app">
      <Header
        mode={game.mode}
        onOpenHelp={() => setModal("help")}
        onOpenStats={() => setModal("stats")}
        onOpenSettings={() => setModal("settings")}
      />

      <main className="board-area">
        <Board game={game} shakeRow={shakeRow} />
      </main>

      <Keyboard
        letterStates={letterStates}
        onKey={handleKey}
        disabled={!acceptsInput(game)}
      />

      <HelpModal open={modal === "help"} onClose={closeModal} />
      <StatsModal
        open={modal === "stats"}
        onClose={closeModal}
        stats={stats}
        game={game}
        onShare={handleShare}
        onPlay={startGame}
      />
      <SettingsModal
        open={modal === "settings"}
        onClose={closeModal}
        settings={settings}
        hardMode={game.hardMode}
        onChange={(patch) => setSettings((current) => ({ ...current, ...patch }))}
        onToggleHardMode={toggleHardMode}
      />
    </div>
  );
}
