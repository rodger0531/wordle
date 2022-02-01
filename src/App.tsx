import React, { useEffect, KeyboardEvent, useState } from "react";
import "./App.css";
import * as R from "ramda";
import dictionary from "./Asset/array";

const isAllowedKey = (key: string): boolean =>
  key.slice(0, 3) === "Key" || key === "Enter" || key === "Backspace";

function App() {
  useEffect(() => {
    // console.log(dictionary);
  }, []);

  const handleKeyPress = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!e.repeat && isAllowedKey(e.code)) {
      if (e.code === "Enter" || e.code === "Backspace") {
        return;
      }
      console.log("test", e.code.slice(3));
    }
  };
  return (
    <div className="App">
      <div className="App-header" tabIndex={-1} onKeyDown={handleKeyPress}>
        Test
      </div>
    </div>
  );
}

export default App;
