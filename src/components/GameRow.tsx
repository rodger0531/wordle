import React from "react";
import { GameState } from "../constants/base";
import GameTile from "./GameTile";

interface IGameRowProps {
  guessResultList: number[][];
  word: string[];
  wordIndex: number;
  guessError: boolean;
  gameState: GameState;
}

const GameRow = ({
  guessResultList,
  word,
  wordIndex,
  guessError,
  gameState,
}: IGameRowProps) => {
  return (
    <div
      className={
        "grid grid-cols-5 gap-1 sm:gap-2" +
        (guessError && wordIndex === guessResultList.length
          ? " invalid-guess"
          : "")
      }
    >
      {word.map((letter, letterIndex) => {
        return (
          <GameTile
            key={letter + letterIndex}
            guessResultList={guessResultList}
            wordIndex={wordIndex}
            letter={letter}
            letterIndex={letterIndex}
            gameState={gameState}
          />
        );
      })}
    </div>
  );
};

export default GameRow;
