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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 80,
        height: 80,
        padding: 2,
        margin: 0.4,
        borderRadius: 0.5,
        fontWeight: "bold",
        border: 3,
        borderColor: grey[800],
        backgroundColor: "gray",
        color: "white",
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
