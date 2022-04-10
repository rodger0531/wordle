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
    const { correct, present, absent } = { ...previousKeyClasses };
    guessResultList.forEach((row, rowIndex) => {
      row.forEach((result, colIndex) => {
        const letter = guessList[rowIndex][colIndex];
        if (result === 2 && !correct.includes(letter)) {
          const presentIndex = present.indexOf(letter);
          if (presentIndex > -1) {
            present.splice(presentIndex, 1);
          }
          correct.push(letter);
        } else if (
          result === 1 &&
          !present.includes(letter) &&
          !correct.includes(letter)
        ) {
          present.push(letter);
        } else if (result === 0 && !absent.includes(letter)) {
          absent.push(letter);
        }
      });
    });
    return { correct, present, absent };
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
