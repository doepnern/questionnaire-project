import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTakeQuizState } from "hooks/useTakeQuizState";
import { QuizSmallOverview, TakeQuizQuestion } from "components";
import { NavBar } from "containers";
import { ReactComponent as RightArrowSVG } from "svg/rightArrow.svg";
import "./takeQuiz.scss";

export default function TakeQuiz() {
  const takingQuizId = parseInt(useParams().quizid);
  const [takingQuiz, , err, , handlers] = useTakeQuizState(takingQuizId);
  const [mobileShown, setMobileShown] = useState(false);
  return (
    <>
      {err.active ? (
        <div>{err.msg}</div>
      ) : (
        <div className="tq_body">
          <NavBar></NavBar>
          <div className="takeQuizArea">
            <div
              className="mobileExpandQuizOverview"
              onClick={() => setMobileShown((s) => !s)}
            >
              <RightArrowSVG />
            </div>
            <div className="tk_quizSmall">
              <QuizSmallOverview
                questions={takingQuiz.fragen}
                handleClickQuestion={(questionIndex) => {
                  handlers.switchQuestion(questionIndex);
                }}
                mobileShown={mobileShown}
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
        </div>
      )}
    </>
  );
}
