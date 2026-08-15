import type { MouseEvent } from "react";
import type { LetterState } from "../game/types";
import { BackspaceIcon } from "../icons";

export const ENTER_KEY = "ENTER";
export const BACKSPACE_KEY = "BACKSPACE";

const KEY_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  [ENTER_KEY, "Z", "X", "C", "V", "B", "N", "M", BACKSPACE_KEY],
];

interface KeyboardProps {
  letterStates: Map<string, LetterState>;
  onKey: (key: string) => void;
  disabled: boolean;
}

const Keyboard = ({ letterStates, onKey, disabled }: KeyboardProps) => {
  const handleClick = (key: string) => (event: MouseEvent<HTMLButtonElement>) => {
    // Drop focus so a following physical Enter does not re-fire this button
    // on top of the window-level key handler.
    event.currentTarget.blur();
    onKey(key);
  };

  return (
    <div className="keyboard" aria-label="Keyboard">
      {KEY_ROWS.map((row, rowIndex) => (
        <div className="keyboard-row" key={rowIndex}>
          {row.map((key) => {
            const isAction = key === ENTER_KEY || key === BACKSPACE_KEY;
            return (
              <button
                key={key}
                type="button"
                className="key"
                data-wide={isAction || undefined}
                data-state={letterStates.get(key)}
                onClick={handleClick(key)}
                disabled={disabled}
                aria-label={key === BACKSPACE_KEY ? "Backspace" : key}
              >
                {key === BACKSPACE_KEY ? (
                  <BackspaceIcon className="key-icon" />
                ) : (
                  key
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Keyboard;
