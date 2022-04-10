import React from "react";
import GameTile from "./GameTile";

interface IGameRowProps {
  guessResultList: number[][];
  word: string[];
  wordIndex: number;
}

const GameRow = ({ guessResultList, word, wordIndex }: IGameRowProps) => {
  return (
    <div className="grid grid-cols-5 gap-1 sm:gap-2">
      {word.map((letter, letterIndex) => {
        return (
          <GameTile
            key={letter + letterIndex}
            guessResultList={guessResultList}
            wordIndex={wordIndex}
            letter={letter}
            letterIndex={letterIndex}
          />
        );
      })}
    </div>
  );
};

export default GameRow;
