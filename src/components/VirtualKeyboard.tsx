import { useEffect, useMemo, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import { DigitStyle, GameState } from "../constants/base";
import { DEFAULT_KEYBOARD_LAYOUT, KEYS_DISPLAY } from "../constants/keyboard";
import { generateButtonTheme, generateKeyClasses } from "../utils/keyboard";
import "./VirtualKeyboard.css";

type KeyClasses = DigitStyle.CORRECT | DigitStyle.PRESENT | DigitStyle.ABSENT;

export type KeyClasesType = Record<KeyClasses, string[]>;

export interface VirtualKeyboardProps {
  processKey: (key: string) => void;
  guessList: string[];
  guessResultList: number[][];
  gameState: GameState;
}

const VirtualKeyboard = ({
  processKey,
  guessList,
  guessResultList,
  gameState,
}: VirtualKeyboardProps) => {
  const [keyClasses, setKeyClasses] = useState<KeyClasesType>({
    correct: [],
    present: [],
    absent: [],
  });

  useEffect(() => {
    if (guessList.length === guessResultList.length) {
      if (guessList.length !== 0) {
        setKeyClasses(generateKeyClasses({ guessResultList, guessList }));
      } else {
        // Reset keyboard key classes on new game
        setKeyClasses({
          correct: [],
          present: [],
          absent: [],
        });
      }
    }
  }, [guessList, guessResultList, gameState]);

  const buttonTheme = useMemo(
    () => [
      {
        class: "operation-keys",
        buttons: "{Enter} {Backspace}",
      },
      ...generateButtonTheme(keyClasses),
    ],
    [keyClasses]
  );

  const onKeyPress = (button: string) => {
    processKey(button.replace(/^{|}$/g, ""));
  };

  return (
    <Keyboard
      onKeyPress={onKeyPress}
      layout={DEFAULT_KEYBOARD_LAYOUT}
      theme={"hg-theme-default myTheme1"}
      display={KEYS_DISPLAY}
      buttonTheme={buttonTheme}
      keyboardDOMClass={"test"}
    />
  );
};

export default VirtualKeyboard;
