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
    handlers,
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
                handlers.switchQuestion(questionIndex);
              }}
            ></QuizSmallOverview>
          </div>
          <div className="tk_takeQuizQuestion">
            <TakeQuizQuestion
              question={handlers.getCurrentlyTakingQuestion()}
              switchQuestion={handlers.switchQuestion}
              handleClickAnswer={handlers.toggleAnswerToSelectedAnswers}
              handleSubmitClick={handlers.submitQuestion}
              buttonText={handlers.getButtonText()}
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
