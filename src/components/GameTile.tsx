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
        border: 3,
        borderColor: grey[800],
        backgroundColor: "gray",
        color: "white",
        width: "68px",
        height: "68px",
        fontSize: "2.25rem",
        "&.present": {
          backgroundColor: "#b59f3b",
        },
        "&.correct": {
          backgroundColor: "#538d4e",
        },
        "&.empty": {
          backgroundColor: "#282c34",
        },
      }}
      elevation={0}
      key={letterIndex}
      className={renderDigitStyle(guessResultList[wordIndex]?.[letterIndex])}
    >
      {letter}
    </Paper>
  );
};

export default GameTile;
