import GameRow from "./GameRow";

interface IGuessListProps {
  displayList: string[][];
  guessResultList: number[][];
}

const Board = ({ displayList, guessResultList }: IGuessListProps) => {
  return (
    <div
      className="flex grow items-center"
      style={{ width: "350px", userSelect: "none" }}
    >
      <div className="grid grid-rows-6 gap-1">
        {displayList.map((word, wordIndex) => {
          return (
            <GameRow
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
