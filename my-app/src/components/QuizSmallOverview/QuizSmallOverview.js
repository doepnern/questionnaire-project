import React from "react";
import QuizSmallOverviewComponents from "./QuizSmallOverviewComponents";
import "./QuizSmallOverview.scss";

/**
 * gets list of questions, displays them in a grid with their status, either unanswerer, or answered
 *  @component
 *  @example
 *  <QuizSmallOverview questions={[{fragenid: 1},{fragenid:3}]} handleClickQuestion={(quizid)=>setCorrect(quizid)} />
 */
export default function QuizSmallOverview({
  questions = [],
  handleClickQuestion,
}) {
  return (
    <QuizSmallOverviewComponents>
      {true &&
        questions.map((q, index) => (
          <QuizSmallOverviewComponents.Question
            question={q}
            index={index}
            key={q.fragenid}
            handleClick={handleClickQuestion}
          />
        ))}
    </QuizSmallOverviewComponents>
  );
}
