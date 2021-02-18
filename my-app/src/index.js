import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import QuestionOverview from "./pages/QuestionOverview";
import * as serviceWorker from "./serviceWorker";
import { QuestionContextProvider } from "context/QuestionContext";

ReactDOM.render(
  <React.StrictMode>
    <QuestionContextProvider>
      <QuestionOverview />
    </QuestionContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
