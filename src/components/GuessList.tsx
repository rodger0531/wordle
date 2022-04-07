import { Paper } from "@mui/material";
import React from "react";
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
                  fontWeight: "bold",
                  backgroundColor: "gray",
                }}
                elevation={4}
                key={letter + letterIndex}
                className={
                  "letter " +
                  renderDigitStyle(guessResultList[wordIndex][letterIndex])
                }
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
