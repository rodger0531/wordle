import { renderDigitStyle } from "../utils";
import { GameState } from "../constants/base";

interface IGameTileProps {
  guessResultList: number[][];
  wordIndex: number;
  letter: string;
  letterIndex: number;
  gameState: GameState;
}

const GameTile = ({
  guessResultList,
  wordIndex,
  letter,
  letterIndex,
  gameState,
}: IGameTileProps) => {
  const isWinningRow =
    gameState === GameState.Win && wordIndex === guessResultList.length - 1;

  return (
    <div
      style={{ animationDelay: `${100 * letterIndex}ms` }}
      className={
        "game-tile h-15 w-15 sm:h-18 sm:w-18 " +
        renderDigitStyle(guessResultList[wordIndex]?.[letterIndex]) +
        (isWinningRow ? " win-guess" : "")
      }
    >
      {letter}
    </div>
  );
};

export default GameTile;
