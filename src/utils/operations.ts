import { DigitStyle, WORD_LENGTH } from "../constants/base";
import { KeyboardEvent } from "react";

export const isAllowedKey = (key: string): boolean =>
  key.slice(0, 3) === "Key" || key === "Enter" || key === "Backspace";

export const processGuess = (guess: string, answer: string): number[] => {
  /*
   * Result array stores the state of each guess digits
   * 0 - Wrong guess
   * 1 - Correct guess, wrong position
   * 2 - All correct
   */
  const result: number[] = [0, 0, 0, 0, 0];
  const leftOverHash: Record<string, string> = {};
  guess.split("").forEach((x, idx) => {
    if (x === answer[idx]) {
      result[idx] = 2;
    } else {
      leftOverHash[idx] = x;
    }
  });
  const leftOver: string[] = Object.keys(leftOverHash);
  let answersLeft = answer
    .split("")
    .map((x, idx) => (leftOver.includes(idx.toString()) ? x : ""))
    .join("");

  Object.entries(leftOverHash).forEach((letter) => {
    const foundIndex = answersLeft.indexOf(letter[1]);
    if (foundIndex >= 0) {
      result[Number(letter[0])] = 1;
      answersLeft =
        answersLeft.slice(0, foundIndex) + answersLeft.slice(foundIndex + 1);
    }
  });
  return result;
};

export const renderDigitStyle = (state?: number): string => {
  if (state === 1) {
    return DigitStyle.PRESENT;
  }
  if (state === 2) {
    return DigitStyle.CORRECT;
  }
  if (state === undefined) {
    return DigitStyle.EMPTY;
  }
  return "";
};

export const blockComboKey = (e: KeyboardEvent<HTMLDivElement>) => {
  return !(e.altKey || e.ctrlKey || e.metaKey);
};

export const generateDisplayList =
  ({
    listLength,
    currentGuess,
  }: {
    listLength: number;
    currentGuess: string;
  }) =>
  (previousList: string[][]) =>
    previousList.map((word, wordIndex) => {
      if (wordIndex === listLength) {
        return currentGuess.padEnd(WORD_LENGTH).split("");
      }
      return word;
    });
