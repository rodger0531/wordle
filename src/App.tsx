import { KeyboardEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import * as R from "ramda";
import list from "./Asset/list";
import indexedList from "./Asset/indexedList";
import { toast } from "react-toastify";
import {
  processGuess,
  generateAnswer,
  isAllowedKey,
  renderDigitStyle,
} from "./utils";

function App() {
  const [answer, setAnswer] = useState<string>(generateAnswer(list));
  const [guessList, setGuessList] = useState<string[]>([]);
  const [guessResultList, setGuessResultList] = useState<number[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const pageRef = useRef<HTMLDivElement>(null!);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.repeat && isAllowedKey(e.code)) {
      if (e.code === "Enter") {
        if (currentGuess.length === 5) {
          const idx = currentGuess[0].charCodeAt(0) - "A".charCodeAt(0);
          if (indexedList[idx].indexOf(R.toLower(currentGuess)) < 0) {
            toast.error("Not in word list");
            return;
          }
          setGuessResultList(R.append(processGuess(currentGuess, answer)));
          setGuessList(R.append(currentGuess));
          setCurrentGuess("");
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
    setAnswer(generateAnswer(list));
    setGuessList([]);
    setCurrentGuess("");
  };

  useEffect(() => {
    pageRef.current.focus();
  }, []);

  return (
    <div className="App">
      <div
        ref={pageRef}
        className="App-header"
        tabIndex={-1}
        onKeyDown={handleKeyPress}
      >
        <button onClick={resetGame}>Reset</button>
        <hr />
        <div>Answer: {answer}</div>
        <div>Current Guess:{currentGuess}</div>
        <div className="guess-list">
          Guess list:
          <ul>
            {guessList.map((x, idx) => (
              <li key={x + idx}>
                {x.split("").map((y, innerIndex) => (
                  <div
                    key={y + innerIndex}
                    className={
                      "letter " +
                      renderDigitStyle(guessResultList[idx][innerIndex])
                    }
                  >
                    {y}
                  </div>
                ))}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
