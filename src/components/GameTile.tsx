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
        // width: "68px",
        // height: "68px",
        fontSize: "2.25rem",
        transition: "all 0.3s ease-in-out",
        "&.present": {
          backgroundColor: "#b59f3b",
        },
        "&.correct": {
          backgroundColor: "#538d4e",
        },
        "&.empty": {
          backgroundColor: "#282c34",
          border: 3,
          borderColor: grey[800],
        },
      }}
      elevation={0}
      key={letterIndex}
      className={
        renderDigitStyle(guessResultList[wordIndex]?.[letterIndex]) +
        " h-15 w-15 sm:h-17 sm:w-17"
      }
    >
      {letter}
    </Paper>
  );
};

export default GameTile;
