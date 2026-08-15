import { MAX_GUESSES, WORD_LENGTH } from "../game/constants";
import type { TileState } from "../game/types";
import Modal from "./Modal";

interface HelpModalProps {
  open: boolean;
  onClose: () => void;
}

interface ExampleProps {
  word: string;
  highlight: number;
  state: Exclude<TileState, "empty" | "filled">;
  description: string;
}

const Example = ({ word, highlight, state, description }: ExampleProps) => (
  <li className="example">
    <div className="row example-row" aria-hidden>
      {[...word].map((letter, index) => (
        <div
          key={index}
          className="tile"
          data-state={index === highlight ? state : "filled"}
        >
          {letter}
        </div>
      ))}
    </div>
    <p>{description}</p>
  </li>
);

const HelpModal = ({ open, onClose }: HelpModalProps) => (
  <Modal open={open} onClose={onClose} title="How to play">
    <div className="prose">
      <p>
        Guess the word in {MAX_GUESSES} tries. Each guess must be a valid{" "}
        {WORD_LENGTH}-letter word.
      </p>
      <p>
        The colour of the tiles shows how close your guess was to the answer.
      </p>
    </div>

    <ul className="examples">
      <Example
        word="WEARY"
        highlight={0}
        state="correct"
        description="W is in the word and in the right spot."
      />
      <Example
        word="PILOT"
        highlight={1}
        state="present"
        description="I is in the word but in the wrong spot."
      />
      <Example
        word="VAGUE"
        highlight={3}
        state="absent"
        description="U is not in the word in any spot."
      />
    </ul>

    <div className="prose">
      <p>A new puzzle is released daily at midnight.</p>
    </div>
  </Modal>
);

export default HelpModal;
