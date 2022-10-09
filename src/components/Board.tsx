import { GameState } from "../constants/base";
import GameRow from "./GameRow";

interface IGuessListProps {
  displayList: string[][];
  guessResultList: number[][];
  guessError: boolean;
  gameState: GameState;
}

const Board = ({
  displayList,
  guessResultList,
  guessError,
  gameState,
}: IGuessListProps) => {
  return (
    <div
      className="flex grow items-center"
      style={{ maxWidth: "380px", userSelect: "none" }}
    >
      <div className="grid grid-rows-6 gap-1 sm:gap-2">
        {displayList.map((word, wordIndex) => {
          return (
            <GameRow
              key={word.join("") + wordIndex}
              guessResultList={guessResultList}
              word={word}
              wordIndex={wordIndex}
              guessError={guessError}
              gameState={gameState}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Board;
