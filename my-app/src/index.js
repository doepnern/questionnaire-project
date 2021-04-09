import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import QuestionOverview from "./pages/QuestionOverview";
import QuizPage from "./pages/QuizPage";
import TakeQuiz from "./pages/TakeQuiz";
import * as serviceWorker from "./serviceWorker";
import { QuestionContextProvider } from "context/QuestionContext";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/quiz/try/:quizid">
          <TakeQuiz></TakeQuiz>
        </Route>
        <Route path="/quiz">
          <QuizPage></QuizPage>
        </Route>
        <Route path="/">
          <QuestionContextProvider>
            <QuestionOverview />
          </QuestionContextProvider>
        </Route>
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
