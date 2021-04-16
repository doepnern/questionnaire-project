import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTakeQuizState } from "hooks/useTakeQuizState";
import { QuizSmallOverview, TakeQuizQuestion } from "components";
import "./takeQuiz.scss";

export default function TakeQuiz() {
  const takingQuizId = parseInt(useParams().quizid);
  const [
    takingQuiz,
    setTakingQuiz,
    err,
    displayError,
    { switchQuestion, getCurrentlyTakingQuestion },
  ] = useTakeQuizState(takingQuizId);
  useEffect(() => {
    console.log(takingQuiz);
  });
  return (
    <>
      {err.active ? (
        <div>{err.msg}</div>
      ) : (
        <div className="testArea">
          <div className="tk_quizSmall">
            <QuizSmallOverview
              questions={takingQuiz.fragen}
              handleClickQuestion={(questionIndex) => {
                console.log("question " + questionIndex + " clicked");
                switchQuestion(questionIndex);
              }}
            ></QuizSmallOverview>
          </div>
          <div className="tk_takeQuizQuestion">
            <TakeQuizQuestion
              question={getCurrentlyTakingQuestion()}
              switchQuestion={switchQuestion}
            ></TakeQuizQuestion>
          </div>
          <div className="placeholder"></div>
        </div>
      )}
    </>
  );
}

/**
 * <QuizSmallOverview
            questions={takingQuiz.fragen}
            handleClickQuestion={(questionId) =>
              console.log("question " + questionId + " clicked")
            }
          ></QuizSmallOverview>
 */
