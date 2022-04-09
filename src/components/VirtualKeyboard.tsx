import React from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import "./VirtualKeyboard.css";

const VirtualKeyboard = ({
  processKey,
}: {
  processKey: (key: string) => void;
}) => {
  const defaultLayout = {
    default: [
      "Q W E R T Y U I O P",
      "A S D F G H J K L",
      "{Enter} Z X C V B N M {Backspace}",
    ],
  };

  const keysDisplay = {
    "{Backspace}": "⌫",
    "{Enter}": "Enter",
  };

  const buttonTheme = [
    {
      class: "operation-keys",
      buttons: "{Enter} {Backspace}",
    },
  ];
  const onKeyPress = (button: string) => {
    processKey(button.replace(/^{|}$/g, ""));
  };
  return (
    <Keyboard
      onKeyPress={onKeyPress}
      layout={defaultLayout}
      theme={"hg-theme-default myTheme1"}
      display={keysDisplay}
      buttonTheme={buttonTheme}
    />
  );
};

export default VirtualKeyboard;
