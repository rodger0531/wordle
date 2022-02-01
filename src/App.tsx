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
  const [guess, setGuess] = useState<[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");

  useEffect(() => {
    console.log(answer);
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.repeat && isAllowedKey(e.code)) {
      if (e.code === "Enter" || e.code === "Backspace") {
        return;
      }
      console.log("test", e.code.slice(3));
    }
  };
  return (
    <div className="App">
      <div className="App-header" tabIndex={-1} onKeyDown={handleKeyPress}>
        {answer}
      </div>
    </div>
  );
}

export default App;
