import { useCountdown } from "../hooks/useCountdown";
import type { GameMode } from "../game/types";
import { RefreshIcon, ShareIcon } from "../icons";
import type { GameState } from "../state/gameReducer";
import type { Stats } from "../state/stats";
import Modal from "./Modal";

interface StatsModalProps {
  open: boolean;
  onClose: () => void;
  stats: Stats;
  game: GameState;
  onShare: () => void;
  onPlay: (mode: GameMode) => void;
}

const Stat = ({ label, value }: { label: string; value: number | string }) => (
  <div className="stat">
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const StatsModal = ({
  open,
  onClose,
  stats,
  game,
  onShare,
  onPlay,
}: StatsModalProps) => {
  const isFinished = game.status !== "playing";
  const isDaily = game.mode === "daily";
  const countdown = useCountdown(open && isDaily && isFinished);

  const winRate = stats.played
    ? Math.round((stats.wins / stats.played) * 100)
    : 0;
  const busiestBucket = Math.max(1, ...stats.distribution);
  const highlightIndex =
    game.status === "won" ? game.guesses.length - 1 : -1;

  return (
    <Modal open={open} onClose={onClose} title="Statistics">
      <div className="stats-grid">
        <Stat label="Played" value={stats.played} />
        <Stat label="Win %" value={winRate} />
        <Stat label="Current streak" value={stats.currentStreak} />
        <Stat label="Max streak" value={stats.maxStreak} />
      </div>

      <h3 className="section-heading">Guess distribution</h3>
      {stats.played === 0 ? (
        <p className="muted">No games played yet.</p>
      ) : (
        <ul className="distribution">
          {stats.distribution.map((count, index) => (
            <li className="distribution-row" key={index}>
              <span className="distribution-label">{index + 1}</span>
              <span
                className="distribution-bar"
                data-current={index === highlightIndex || undefined}
                style={{ width: `${Math.max(7, (count / busiestBucket) * 100)}%` }}
              >
                {count}
              </span>
            </li>
          ))}
        </ul>
      )}

      {isFinished && (
        <div className="stats-footer">
          {isDaily ? (
            <>
              <div className="countdown">
                <div className="countdown-label">Next Wordle</div>
                <div className="countdown-value">{countdown}</div>
              </div>
              <button type="button" className="button primary" onClick={onShare}>
                Share <ShareIcon className="icon" />
              </button>
            </>
          ) : (
            <button
              type="button"
              className="button primary full"
              onClick={() => onPlay("practice")}
            >
              New word <RefreshIcon className="icon" />
            </button>
          )}
        </div>
      )}

      <button
        type="button"
        className="button ghost full"
        onClick={() => onPlay(isDaily ? "practice" : "daily")}
      >
        {isDaily ? "Practice with a random word" : "Back to today's Wordle"}
      </button>

      {isDaily && (
        <p className="muted center small">
          Only daily puzzles count towards your streak.
        </p>
      )}
    </Modal>
  );
};

export default StatsModal;
