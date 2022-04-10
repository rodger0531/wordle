import GameRow from "./GameRow";

interface IGuessListProps {
  displayList: string[][];
  guessResultList: number[][];
}

const Board = ({ displayList, guessResultList }: IGuessListProps) => {
  return (
    <div
      className="flex grow items-center"
      style={{ maxWidth: "380px", userSelect: "none" }}
    >
      <div className="grid grid-rows-6 gap-1 sm:gap-2">
        {displayList.map((word, wordIndex) => {
          return (
            <GameRow
              key={word.join("") + wordIndex}
              guessResultList={guessResultList}
              word={word}
              wordIndex={wordIndex}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Board;
