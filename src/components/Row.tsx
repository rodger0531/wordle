import { WORD_LENGTH } from "../game/constants";
import type { TileState } from "../game/types";
import Tile, { type TileAnimation } from "./Tile";

interface RowProps {
  letters: string[];
  states: TileState[];
  animation: TileAnimation;
  shake: boolean;
  rowNumber: number;
}

const Row = ({ letters, states, animation, shake, rowNumber }: RowProps) => (
  <div
    className="row"
    data-shake={shake || undefined}
    role="group"
    aria-label={`Row ${rowNumber}`}
  >
    {Array.from({ length: WORD_LENGTH }, (_, index) => (
      <Tile
        key={index}
        index={index}
        letter={letters[index] ?? ""}
        state={states[index] ?? "empty"}
        animation={animation}
      />
    ))}
  </div>
);

export default Row;
