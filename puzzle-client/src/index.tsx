import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import { App } from "./components/App";
import { enableMapSet } from "immer";
import { BrowserRouter } from "react-router-dom";

enableMapSet();

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root"),
);
