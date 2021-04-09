import { getQuiz } from "services/UserService";
import React, { useEffect, useState } from "react";

export function useTakeQuizState(takingQuizId) {
  const [takingQuiz, setTakingQuiz] = useState([]);
  const [err, setErr] = useState({ active: false, msg: "" });
  //on initial render find quiz passed into function, set error if it cant be found
  useEffect(() => {
    if (takingQuizId == null || isNaN(takingQuizId))
      displayError(`please use valid quizid, given is ${takingQuizId}`);
    else {
      getQuiz(1, (res) =>
        setTakingQuiz(findCurrentQuiz(res.result[0].quizzes, takingQuizId))
      );
    }
  }, []);

  //if quiz disappears, display error
  useEffect(() => {
    if (takingQuiz === undefined)
      displayError("couldnt find the quiz you selected: " + takingQuizId);
  }, [takingQuiz]);

  function findCurrentQuiz(quizzes, quizid) {
    const quizFound = quizzes.find((q) => q.quizid === quizid);
    //if quiz has fragen, sort them according to their position
    if (quizFound.fragen instanceof Array)
      return {
        ...quizFound,
        fragen: quizFound.fragen.sort((a, b) => (a.pos <= b.pos ? -1 : 1)),
      };
    return quizFound;
  }
  function displayError(err) {
    setErr({ active: true, msg: err });
  }

  return [takingQuiz, setTakingQuiz, err, displayError];
}
