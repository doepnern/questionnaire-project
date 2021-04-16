import { getQuiz } from "services/UserService";
import React, { useEffect, useState } from "react";

export function useTakeQuizState(takingQuizId) {
  const initialState = { fragen: [], currentQuestion: -1 };
  const [takingQuiz, setTakingQuiz] = useState(initialState);
  const [err, setErr] = useState({ active: false, msg: "" });

  //on initial render find quiz passed into function, set error if it cant be found
  useEffect(() => {
    if (takingQuizId == null || isNaN(takingQuizId))
      displayError(`please use valid quizid, given is ${takingQuizId}`);
    else {
      getQuiz(1, (res) =>
        setTakingQuiz({
          ...initialState,
          ...findCurrentQuiz(res.result[0].quizzes, takingQuizId),
        })
      );
    }
  }, []);

  //if quiz disappears, display error
  useEffect(() => {
    if (takingQuiz === undefined)
      displayError("couldnt find the quiz you selected: " + takingQuizId);
  }, [takingQuiz]);

  //finds the current quiz from all quizees of the user returned by the backend
  function findCurrentQuiz(quizzes, quizid) {
    const quizFound = quizzes.find((q) => q.quizid === quizid);
    if (quizFound == null) {
      displayError("quiz with id " + quizid + " couldnt be found");
      return initialState;
    }
    //if quiz has fragen, sort them according to their position, for now set starting question to question at index 0
    if (quizFound.fragen instanceof Array) {
      const sortedFragen = quizFound.fragen.sort((a, b) =>
        a.pos <= b.pos ? -1 : 1
      );
      if (quizFound.fragen.length < 1)
        displayError(
          "please add some questions to your quiz before taking your quiz"
        );
      return {
        ...quizFound,
        fragen: sortedFragen,
        currentQuestion: sortedFragen.length > 0 ? 0 : -1,
      };
    }
    return quizFound;
  }
  //sets the error to be true and displays a given message
  function displayError(err) {
    setErr({ active: true, msg: err });
  }

  //switches to question at index questionIndex
  function switchQuestion(questionIndex) {
    if (takingQuiz.fragen.length <= questionIndex || questionIndex < 0) {
      displayError(
        "cant switch to question nr. " +
          questionIndex +
          " ,this quiz has only " +
          takingQuiz.fragen.length +
          " questions"
      );
    }
    setTakingQuiz((tk) => ({ ...tk, currentQuestion: questionIndex }));
  }

  function getCurrentlyTakingQuestion() {
    //if no question is currently taken, return undefined
    if (
      takingQuiz.fragen.length <= takingQuiz.currentQuestion ||
      takingQuiz.currentQuestion < 0
    ) {
      return undefined;
    }
    return {
      ...takingQuiz.fragen[takingQuiz.currentQuestion],
      index: takingQuiz.currentQuestion + 1,
    };
  }

  return [
    takingQuiz,
    setTakingQuiz,
    err,
    displayError,
    { switchQuestion, getCurrentlyTakingQuestion },
  ];
}
