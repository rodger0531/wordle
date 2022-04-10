import {
  KeyClasesType,
  VirtualKeyboardProps,
} from "../components/VirtualKeyboard";
import { DigitStyle } from "../constants/base";

export const generateKeyClasses =
  ({
    guessResultList,
    guessList,
  }: Pick<VirtualKeyboardProps, "guessResultList" | "guessList">) =>
  (previousKeyClasses: KeyClasesType) => {
    const newKeyClasses = { ...previousKeyClasses };
    guessResultList.forEach((row, rowIndex) => {
      row.forEach((result, colIndex) => {
        const letter = guessList[rowIndex][colIndex];
        if (result === 2 && !newKeyClasses.correct.includes(letter)) {
          const presentIndex = newKeyClasses.present.indexOf(letter);
          if (presentIndex > -1) {
            newKeyClasses.present.splice(presentIndex, 1);
          }
          newKeyClasses.correct.push(letter);
        } else if (
          result === 1 &&
          !newKeyClasses.present.includes(letter) &&
          !newKeyClasses.correct.includes(letter)
        ) {
          newKeyClasses.present.push(letter);
        } else if (result === 0 && !newKeyClasses.absent.includes(letter)) {
          newKeyClasses.absent.push(letter);
        }
      });
    });
    return newKeyClasses;
  };

export const generateButtonTheme = (keyClasses: KeyClasesType) => {
  return [
    ...(keyClasses.correct.length > 0
      ? [
          {
            class: DigitStyle.CORRECT,
            buttons: keyClasses.correct.join(" "),
          },
        ]
      : []),
    ...(keyClasses.present.length > 0
      ? [
          {
            class: DigitStyle.PRESENT,
            buttons: keyClasses.present.join(" "),
          },
        ]
      : []),
    ...(keyClasses.absent.length > 0
      ? [
          {
            class: DigitStyle.ABSENT,
            buttons: keyClasses.absent.join(" "),
          },
        ]
      : []),
  ];
};
