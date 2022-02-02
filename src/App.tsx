import React, { KeyboardEvent, useState } from "react";
import "./App.css";
import * as R from "ramda";
import list from "./Asset/list";
import indexedList from "./Asset/indexedList";
import { toast } from "react-toastify";

const isAllowedKey = (key: string): boolean =>
  key.slice(0, 3) === "Key" || key === "Enter" || key === "Backspace";

const generateAnswer = (): string => {
  const idx = Math.floor(Math.random() * list.length);
  return R.toUpper(list[idx]);
};

const processGuess = (_guess: string, _answer: string): number[] => {
  let guess: string[] = _guess.slice().split("");
  /*
   * Result array stores the state of each guess digits
   * 0 - Wrong guess
   * 1 - Correct guess, wrong position
   * 2 - All correct
   */
  let result: number[] = [0, 0, 0, 0, 0];
  let leftOverHash: Record<string, string> = {};
  guess.forEach((x, idx) => {
    if (x === _answer[idx]) {
      result[idx] = 2;
    } else {
      leftOverHash[idx] = x;
    }
  });
  let tempAnswer: string = _answer.slice();
  Object.entries(leftOverHash).forEach((x) => {
    const foundIndex = tempAnswer.indexOf(x[1]);
    if (foundIndex >= 0) {
      result[Number(x[0])] = 1;
      tempAnswer =
        tempAnswer.slice(0, foundIndex) + tempAnswer.slice(foundIndex + 1);
    }
  });
  return result;
};

function App() {
  const [answer, setAnswer] = useState<string>(generateAnswer());
  const [guessList, setGuessList] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.repeat && isAllowedKey(e.code)) {
      if (e.code === "Enter") {
        if (currentGuess.length === 5) {
          const idx = currentGuess[0].charCodeAt(0) - "A".charCodeAt(0);
          if (indexedList[idx].indexOf(R.toLower(currentGuess)) < 0) {
            toast.error("Not in word list");
            return;
          }
          const guessResult = processGuess(currentGuess, answer);
          setGuessList(R.append(currentGuess + ": " + guessResult));
          setCurrentGuess("");
          console.log("finished Enter");
        }
        return;
      }
      if (e.code === "Backspace") {
        setCurrentGuess(R.slice(0, -1));
        return;
      }
      if (currentGuess.length < 5) {
        setCurrentGuess(R.flip(R.concat)(e.code.slice(3)));
      }
    }
  };

  const resetGame = () => {
    setAnswer(generateAnswer());
    setGuessList([]);
    setCurrentGuess("");
  };

  return (
    <div className="App">
      <div className="App-header" tabIndex={-1} onKeyDown={handleKeyPress}>
        <button onClick={resetGame}>Reset</button>
        <hr />
        <div>Answer: {answer}</div>
        <div>Current Guess:{currentGuess}</div>
        <div>
          Guess list:
          <ul>
            {guessList.map((x, idx) => (
              <li key={x + idx}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
