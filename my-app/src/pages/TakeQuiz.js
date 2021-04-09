import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getQuiz } from "services/UserService";

export default function TakeQuiz() {
  const takingQuizId = parseInt(useParams().quizid);
  const [takingQuiz, setTakingQuiz] = useState([]);
  const [err, setErr] = useState({ active: false, msg: "" });
  useEffect(() => {
    if (takingQuizId == null || isNaN(takingQuizId))
      displayError(`please use valid quizid, given is ${takingQuizId}`);
    else {
      getQuiz(1, (res) =>
        setTakingQuiz(findCurrentQuiz(res.result[0].quizzes, takingQuizId))
      );
    }
  }, []);
  useEffect(() => {
    if (takingQuiz === undefined)
      displayError("couldnt find the quiz you selected: " + takingQuizId);
  }, [takingQuiz]);

  return (
    <>
      {err.active ? (
        <div>{err.msg}</div>
      ) : (
        <div>taking quiz:{JSON.stringify(takingQuiz, null, 3)}</div>
      )}
    </>
  );

  function findCurrentQuiz(quizzes, quizid) {
    return quizzes.find((q) => q.quizid === quizid);
  }
  function displayError(err) {
    setErr({ active: true, msg: err });
  }
}
