import { toast } from "react-toastify";

export const generateWinMessages = (numberOfGuesses: number) => {
  let message = "";
  if (numberOfGuesses === 1) {
    message = "That was INSANE! You got it in 1 guess!";
  } else if (numberOfGuesses === 2) {
    message = "That was AWESOME! You got it in 2 guesses!";
  } else if (numberOfGuesses === 3) {
    message = "That was GOOD! You got it in 3 guesses!";
  } else {
    message = "Not bad! You got it in " + numberOfGuesses + " guesses!";
  }
  toast.success(message, { autoClose: false });
};
