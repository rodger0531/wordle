import { DigitStyle } from "../constants/base";

export const isAllowedKey = (key: string): boolean =>
  key.slice(0, 3) === "Key" || key === "Enter" || key === "Backspace";

export const findNewIndex = (
  target: string,
  base: string,
  exclude: number[],
  index: number = 0
): number => {
  const foundIndex = base.indexOf(target, index);
  if (foundIndex > -1 && exclude[foundIndex]) {
    return findNewIndex(target, base, exclude, foundIndex + 1);
  }
  return foundIndex;
};

export const processGuess = (_guess: string, answer: string): number[] => {
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
    if (x === answer[idx]) {
      result[idx] = 2;
    } else {
      leftOverHash[idx] = x;
    }
  });
  let tempAnswer: string = answer.slice();
  Object.entries(leftOverHash).forEach((x) => {
    const foundIndex = findNewIndex(x[1], tempAnswer, result);
    if (foundIndex >= 0) {
      result[Number(x[0])] = 1;
      tempAnswer =
        tempAnswer.slice(0, foundIndex) + tempAnswer.slice(foundIndex + 1);
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
