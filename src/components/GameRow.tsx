import React from "react";
import GameTile from "./GameTile";

interface IGameRowProps {
  guessResultList: number[][];
  word: string[];
  wordIndex: number;
}

const GameRow = ({ guessResultList, word, wordIndex }: IGameRowProps) => {
  return (
    <>
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
    </>
  );
};

export default GameRow;
