import { KeyboardEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import * as R from "ramda";
import list from "./Asset/list";
import indexedList from "./Asset/indexedList";
import { toast } from "react-toastify";
import { processGuess, generateAnswer, isAllowedKey } from "./utils";
import { GameState } from "./constants/base";
import GuessList from "./components/GuessList";
import InformationPanel from "./components/InformationPanel";
import { Button } from "@mui/material";

function App() {
  const [answer, setAnswer] = useState<string>(generateAnswer(list));
  const [guessList, setGuessList] = useState<string[]>([]);
  const [guessResultList, setGuessResultList] = useState<number[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const pageRef = useRef<HTMLDivElement>(null!);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.repeat && isAllowedKey(e.code) && gameState === GameState.PLAYING) {
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
    setGameState(GameState.PLAYING);
  };

  useEffect(() => {
    pageRef.current.focus();
  }, []);

  useEffect(() => {
    if (answer === guessList[guessList.length - 1]) {
      toast.success("Congratulations! You win!");
      setGameState(GameState.FINISHED);
    }
  }, [answer, guessList]);

  return (
    <div className="App">
      <div
        ref={pageRef}
        className="App-header"
        tabIndex={-1}
        onKeyDown={handleKeyPress}
      >
        <Button variant="contained" onClick={resetGame}>
          Restart Game
        </Button>
        <hr />
        <InformationPanel answer={answer} currentGuess={currentGuess} />
        <GuessList guessList={guessList} guessResultList={guessResultList} />
      </div>
    </div>
  );
}

export default App;
