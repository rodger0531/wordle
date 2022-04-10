import { toast } from "react-toastify";

export const generateWinMessages = (numberOfGuesses: number) => {
  if (numberOfGuesses === 1) {
    toast.success("That was INSANE! You got it in 1 guess!");
  } else if (numberOfGuesses === 2) {
    toast.success("That was AWESOME! You got it in 2 guesses!");
  } else if (numberOfGuesses === 3) {
    toast.success("That was GOOD! You got it in 3 guesses!");
  } else {
    toast.success("Not bad! You got it in " + numberOfGuesses + " guesses!");
  }
};
