import { useMemo } from "react";
import { MAX_GUESSES, WORD_LENGTH } from "../game/constants";
import { scoreGuess } from "../game/scoring";
import type { TileState } from "../game/types";
import type { GameState } from "../state/gameReducer";
import Row from "./Row";
import type { TileAnimation } from "./Tile";

interface BoardProps {
  game: GameState;
  /** Row index that should shake, or null. */
  shakeRow: number | null;
}

interface RowData {
  letters: string[];
  states: TileState[];
  animation: TileAnimation;
}

const emptyStates = Array<TileState>(WORD_LENGTH).fill("empty");

const Board = ({ game, shakeRow }: BoardProps) => {
  const { guesses, current, answer, revealedRows, status } = game;

  const rows = useMemo<RowData[]>(
    () =>
      Array.from({ length: MAX_GUESSES }, (_, rowIndex): RowData => {
        const guess = guesses[rowIndex];

        if (guess !== undefined) {
          const isRevealingRow = rowIndex === revealedRows;
          const isWinningRow =
            status === "won" && rowIndex === guesses.length - 1;

          return {
            letters: [...guess],
            states: scoreGuess(guess, answer),
            animation: isRevealingRow ? "flip" : isWinningRow ? "bounce" : "none",
          };
        }

        // The row the player is currently typing into.
        if (rowIndex === guesses.length && status === "playing") {
          return {
            letters: [...current],
            states: Array.from({ length: WORD_LENGTH }, (_, i) =>
              i < current.length ? "filled" : "empty"
            ),
            animation: "none",
          };
        }

        return { letters: [], states: emptyStates, animation: "none" };
      }),
    [guesses, current, answer, revealedRows, status]
  );

  return (
    <div className="board" aria-label="Game board">
      {rows.map((row, rowIndex) => (
        <Row
          key={rowIndex}
          rowNumber={rowIndex + 1}
          letters={row.letters}
          states={row.states}
          animation={row.animation}
          shake={shakeRow === rowIndex}
        />
      ))}
    </div>
  );
};

export default Board;
