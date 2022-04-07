import React from "react";

interface IInformationPanelProps {
  answer: string;
  currentGuess: string;
}

function InformationPanel({ answer, currentGuess }: IInformationPanelProps) {
  return (
    <>
      <div>Answer: {answer}</div>
      <div>Current Guess:{currentGuess}</div>
    </>
  );
}

export default InformationPanel;
