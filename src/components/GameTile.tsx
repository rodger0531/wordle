import React from "react";
import { Paper } from "@mui/material";
import { renderDigitStyle } from "../utils";
import { grey } from "@mui/material/colors";

interface IGameTileProps {
  guessResultList: number[][];
  wordIndex: number;
  letter: string;
  letterIndex: number;
}
const GameTile = ({
  guessResultList,
  wordIndex,
  letter,
  letterIndex,
}: IGameTileProps) => {
  return (
    <Paper
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0.5,
        fontWeight: "bold",
        backgroundColor: "gray",
        borderColor: grey[800],
        color: "white",
        fontSize: "2.25rem",
        transition: "background-color 0.3s ease-in-out",
        "&.present": {
          backgroundColor: "#b59f3b",
        },
        "&.correct": {
          backgroundColor: "#538d4e",
        },
        "&.empty": {
          backgroundColor: "#282c34",
          border: 2,
          borderColor: grey[800],
        },
      }}
      elevation={0}
      key={letterIndex}
      className={
        renderDigitStyle(guessResultList[wordIndex]?.[letterIndex]) +
        " h-15 w-15 sm:h-18 sm:w-18"
      }
    >
      {letter}
    </Paper>
  );
};

export default GameTile;
