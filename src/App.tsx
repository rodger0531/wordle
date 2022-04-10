import { KeyboardEvent, useEffect, useRef, useState } from "react";
import "./App.css";
import * as R from "ramda";
import list from "./Asset/commonList";
import indexedList from "./Asset/indexedList";
import { toast } from "react-toastify";
import {
  processGuess,
  generateAnswer,
  isAllowedKey,
  blockComboKey,
} from "./utils";
import { ALLOWED_GUESSES, GameState, WORD_LENGTH } from "./constants/base";
import Board from "./components/Board";
import { Button } from "@mui/material";
import VirtualKeyboard from "./components/VirtualKeyboard";

function App() {
  const [answer, setAnswer] = useState<string>(generateAnswer(list));
  const [guessList, setGuessList] = useState<string[]>([]);
  const [guessResultList, setGuessResultList] = useState<number[][]>([]);
  const [currentGuess, setCurrentGuess] = useState<string>("");
  const [displayList, setDisplayList] = useState<string[][]>(
    new Array(ALLOWED_GUESSES).fill(new Array(WORD_LENGTH).fill(""))
  );
  const [gameState, setGameState] = useState<GameState>(GameState.PLAYING);
  const pageRef = useRef<HTMLDivElement>(null!);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.repeat && isAllowedKey(e.code) && blockComboKey(e)) {
      processKey(e.code.replace("Key", ""));
    }
  };

  const processKey = (key: string) => {
    if (gameState === GameState.PLAYING) {
      if (key === "Enter") {
        if (currentGuess.length === 5) {
          const idx = currentGuess[0].charCodeAt(0) - "A".charCodeAt(0);
          if (indexedList[idx].indexOf(R.toLower(currentGuess)) < 0) {
            toast.error("Not in word list");
            return;
          }
          setGuessResultList(R.append(processGuess(currentGuess, answer)));
          setGuessList(R.append(currentGuess));
          setCurrentGuess("");
        } else {
          toast.error("Not enough letters");
        }
        return;
      }
      if (key === "Backspace") {
        setCurrentGuess(R.slice(0, -1));
        return;
      }
      if (currentGuess.length < 5) {
        setCurrentGuess(R.flip(R.concat)(key));
      }
    }
  };

  const resetGame = () => {
    setAnswer(generateAnswer(list));
    setGuessList([]);
    setCurrentGuess("");
    setGuessResultList([]);
    setDisplayList(
      new Array(ALLOWED_GUESSES).fill(new Array(WORD_LENGTH).fill(""))
    );
    setGameState(GameState.PLAYING);
  };

  // Focus on page when game starts, allowing user to start typing
  useEffect(() => {
    pageRef.current.focus();
  }, [gameState]);

  useEffect(() => {
    console.log("Answer: ", answer);
  }, [answer]);

  // Determine game state
  useEffect(() => {
    if (answer === guessList[guessList.length - 1]) {
      toast.success("Congratulations! You win!");
      setGameState(GameState.FINISHED);
    } else if (guessList.length >= ALLOWED_GUESSES) {
      toast.error("You lose! The answer is " + answer);
      setGameState(GameState.FINISHED);
    }
  }, [answer, guessList]);

  // Update display list
  useEffect(() => {
    if (gameState === GameState.PLAYING && guessList.length < ALLOWED_GUESSES) {
      const listLength = guessList.length;
      setDisplayList((prev) =>
        prev.map((word, wordIndex) => {
          if (wordIndex === listLength) {
            return currentGuess.padEnd(WORD_LENGTH).split("");
          }
          return word;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentGuess, gameState]);

  return (
    <div className="App">
      <div
        ref={pageRef}
        className="App-header p-2"
        tabIndex={-1}
        onKeyDown={handleKeyPress}
      >
        <Button variant="contained" onClick={resetGame}>
          Restart Game
        </Button>
        <Board displayList={displayList} guessResultList={guessResultList} />
        <VirtualKeyboard processKey={processKey} />
      </div>
    </div>
  );
}

export default App;
