import * as R from "ramda";

export const generateAnswer = (list: string[]): string => {
  const idx = Math.floor(Math.random() * list.length);
  return R.toUpper(list[idx]);
};
