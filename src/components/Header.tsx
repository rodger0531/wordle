import type { GameMode } from "../game/types";
import { HelpIcon, SettingsIcon, StatsIcon } from "../icons";

interface HeaderProps {
  mode: GameMode;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onOpenSettings: () => void;
}

const Header = ({
  mode,
  onOpenHelp,
  onOpenStats,
  onOpenSettings,
}: HeaderProps) => (
  <header className="header">
    <div className="header-side">
      <button
        type="button"
        className="icon-button"
        onClick={onOpenHelp}
        aria-label="How to play"
      >
        <HelpIcon className="icon" />
      </button>
    </div>

    <h1 className="title">
      Wordle
      {mode === "practice" && <span className="title-badge">Practice</span>}
    </h1>

    <div className="header-side header-side-end">
      <button
        type="button"
        className="icon-button"
        onClick={onOpenStats}
        aria-label="Statistics"
      >
        <StatsIcon className="icon" />
      </button>
      <button
        type="button"
        className="icon-button"
        onClick={onOpenSettings}
        aria-label="Settings"
      >
        <SettingsIcon className="icon" />
      </button>
    </div>
  </header>
);

export default Header;
