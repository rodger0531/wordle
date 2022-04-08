interface IInformationPanelProps {
  answer: string;
}

function InformationPanel({ answer }: IInformationPanelProps) {
  return (
    <>
      <div>Answer: {answer}</div>
    </>
  );
}

export default InformationPanel;
