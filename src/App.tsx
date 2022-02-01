import React, { useEffect } from "react";
import "./App.css";
import * as R from "ramda";
import dictionary from "./Asset/array";

function App() {
  useEffect(() => {
    console.log(dictionary);
  }, []);
  return (
    <div className="App">
      <header className="App-header">Test</header>
    </div>
  );
}

export default App;
