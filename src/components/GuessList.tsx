import { Paper } from "@mui/material";
import { amber, lightGreen } from "@mui/material/colors";
import { renderDigitStyle } from "../utils";

interface IGuessListProps {
  guessList: string[];
  guessResultList: number[][];
}

const GuessList = ({ guessList, guessResultList }: IGuessListProps) => {
  return (
    <div className="guess-list">
      <ul>
        {guessList.map((word, wordIndex) => (
          <li key={word + wordIndex}>
            {word.split("").map((letter, letterIndex) => (
              <Paper
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 80,
                  height: 80,
                  padding: 2,
                  margin: 0.5,
                  borderRadius: 0.5,
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  color: "white",
                  "&.present": {
                    backgroundColor: amber["A400"],
                  },
                  "&.correct": {
                    backgroundColor: lightGreen[700],
                  },
                }}
                elevation={4}
                key={letter + letterIndex}
                className={renderDigitStyle(
                  guessResultList[wordIndex][letterIndex]
                )}
              >
                {letter}
              </Paper>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GuessList;
