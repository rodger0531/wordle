import React, { useEffect, KeyboardEvent, useState } from "react";
import "./App.css";
import * as R from "ramda";
import list from "./Asset/list";
import indexedList from "./Asset/indexedList";

const isAllowedKey = (key: string): boolean =>
  key.slice(0, 3) === "Key" || key === "Enter" || key === "Backspace";

const generateAnswer = (): string => {
  const idx = Math.floor(Math.random() * list.length);
  return list[idx].toUpperCase();
};

function App() {
  const [answer, setAnswer] = useState<string>(generateAnswer());
  const [guessList, setGuessList] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.repeat && isAllowedKey(e.code)) {
      if (e.code === "Enter") {
        if (currentGuess.length === 5) {
          setGuessList((prev) => {
            const newArr = [...prev];
            newArr.push(currentGuess);
            return newArr;
          });
          setCurrentGuess("");
        }
        return;
      }
      if (e.code === "Backspace") {
        setCurrentGuess((prev) => prev.slice(0, -1));
        return;
      }
      if (currentGuess.length < 5) {
        setCurrentGuess((prev) => prev + e.code.slice(3));
      }
    }
  };

  return (
    <div className="App">
      <div className="App-header" tabIndex={-1} onKeyDown={handleKeyPress}>
        <div>answer: {answer}</div>
        <div>current Guess:{currentGuess}</div>
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
