import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTakeQuizState } from "hooks/useTakeQuizState";
import { QuizSmallOverview } from "components";
import "./takeQuiz.scss";

export default function TakeQuiz() {
  const takingQuizId = parseInt(useParams().quizid);
  const [takingQuiz, setTakingQuiz, err, displayError] = useTakeQuizState(
    takingQuizId
  );
  useEffect(() => {
    console.log(takingQuiz);
  });
  return (
    <>
      {err.active ? (
        <div>{err.msg}</div>
      ) : (
        <div className="testArea">
          <QuizSmallOverview
            questions={takingQuiz.fragen}
            handleClickQuestion={(questionId) =>
              console.log("question " + questionId + " clicked")
            }
          ></QuizSmallOverview>
        </div>
      )}
    </>
  );
}
