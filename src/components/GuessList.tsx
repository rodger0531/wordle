import { Paper } from "@mui/material";
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
                  width: 75,
                  height: 75,
                  padding: 2,
                  margin: 0.4,
                  borderRadius: 0.5,
                  fontWeight: "bold",
                  backgroundColor: "gray",
                  color: "white",
                  "&.present": {
                    backgroundColor: "#b59f3b",
                  },
                  "&.correct": {
                    backgroundColor: "#538d4e",
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
