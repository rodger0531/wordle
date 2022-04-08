import { useEffect, useState } from "react";
import { GameState } from "../constants/base";
import GameRow from "./GameRow";

interface IGuessListProps {
  displayList: string[][];
  guessResultList: number[][];
  currentGuess: string;
}

const Board = ({
  displayList,
  guessResultList,
  currentGuess,
}: IGuessListProps) => {
  return (
    <div className="guess-list">
      <ul>
        {displayList.map((word, wordIndex) => {
          return (
            <li key={word.join("") + wordIndex}>
              <GameRow
                guessResultList={guessResultList}
                word={word}
                wordIndex={wordIndex}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Board;
