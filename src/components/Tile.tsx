import type { CSSProperties } from "react";
import type { TileState } from "../game/types";

export type TileAnimation = "none" | "flip" | "bounce";

interface TileProps {
  letter: string;
  state: TileState;
  /** Position in the row, used to stagger flip and bounce animations. */
  index: number;
  animation: TileAnimation;
}

const labelFor = (letter: string, state: TileState) => {
  if (state === "empty") return "empty";
  if (state === "filled") return letter;
  return `${letter}, ${state}`;
};

const Tile = ({ letter, state, index, animation }: TileProps) => (
  <div
    className="tile"
    data-state={state}
    data-animation={animation}
    style={{ "--tile-index": index } as CSSProperties}
    aria-label={labelFor(letter, state)}
  >
    {letter}
  </div>
);

export default Tile;
