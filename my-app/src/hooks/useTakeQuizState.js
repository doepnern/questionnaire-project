import { getQuiz, updateQuiz } from "services/UserService";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export function useTakeQuizState(takingQuizId) {
  const initialState = { fragen: [], currentQuestion: -1 };
  const [takingQuiz, setTakingQuiz] = useState(initialState);
  const [err, setErr] = useState({ active: false, msg: "" });
  const history = useHistory();

  const refresh = (
    keepCurrentQuestion = false,
    findFirstUnanswered = false
  ) => {
    if (takingQuizId == null || isNaN(takingQuizId))
      displayError(`please use valid quizid, given is ${takingQuizId}`);
    else {
      getQuiz(
        1,
        (res) =>
          setTakingQuiz((tq) => {
            const baseState = keepCurrentQuestion ? tq : initialState;
            const quizFromDB = findCurrentQuiz(
              res.result[0].quizzes,
              takingQuizId
            );
            const firstUnanswered = quizFromDB.fragen.findIndex(
              (f) => !f.beantwortet
            );
            return {
              ...baseState,
              ...quizFromDB,
              currentQuestion: keepCurrentQuestion
                ? tq.currentQuestion
                : findFirstUnanswered
                ? firstUnanswered > -1
                  ? firstUnanswered
                  : 0
                : 0,
            };
          }),
        () => displayError("backend unreachable, try again later")
      );
    }
  };

  //on initial render find quiz passed into function, set error if it cant be found
  useEffect(() => {
    refresh(false, true);
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

  //switches to next question, if there is no next question, exits the quiz
  function nextQuestion() {
    if (isLastQuestion()) {
      syncDbToQuiz({ ...takingQuiz, beendet: true });
      history.push("/quiz");
      return;
    }
    switchQuestion(takingQuiz.currentQuestion + 1);
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

  function toggleAnswerToSelectedAnswers(answer, question) {
    if (
      !question ||
      !question.fragenid ||
      !answer ||
      isNaN(parseInt(answer.id))
    ) {
      console.log(
        "no valid question or answer given to add selected answer to " +
          JSON.stringify(question, null, 1) +
          ", " +
          JSON.stringify(answer, null, 1) +
          "make sure question has key fragenid and answer has key id"
      );
      return;
    }
    if (question.beantwortet) {
      console.log(
        "the question is already answerd, cant change your input anymore"
      );
      return;
    }
    //if selected answers of question contains the answer, remove it, otherwise add it
    setTakingQuiz((tq) => ({
      ...tq,
      fragen: replaceQuestion(tq.fragen, {
        ...question,
        ausgewaehlteAntworten: question.ausgewaehlteAntworten.some(
          (id) => id && id === answer.id
        )
          ? question.ausgewaehlteAntworten.filter((id) => id !== answer.id)
          : [...question.ausgewaehlteAntworten, answer.id],
      }),
    }));
  }

  //checks correctness of answers for question, sets beantwortet, updates db quiz status to represent current state
  function submitQuestion(question) {
    if (!question || !question.fragenid)
      return console.log(
        "cant submit question" + JSON.stringify(question, null, 1)
      );
    if (question.beantwortet) nextQuestion();
    setTakingQuiz((tq) =>
      syncDbToQuiz({
        ...tq,
        fragen: replaceQuestion(tq.fragen, { ...question, beantwortet: true }),
      })
    );
  }

  function syncDbToQuiz(newObj) {
    console.log({ newObj });
    if (newObj?.quizid && parseInt(newObj.quizid) > -1) {
      updateQuiz(
        newObj,
        1,
        () => undefined,
        (res) =>
          displayError(
            "cant reach db to sync your progress" + JSON.stringify(res, null, 4)
          )
      );
    }
    return newObj;
  }

  function getButtonText() {
    const curQ = getCurrentlyTakingQuestion();
    //if current question has not been submitted, buttonText is Check, otherwise it is Next, except if currentIndex is last question, then it is finish quiz
    if (!curQ) {
      return "error, no question";
    }
    return curQ.beantwortet ? (isLastQuestion() ? "Finish" : "Next") : "Check";
  }

  function isLastQuestion() {
    return takingQuiz.currentQuestion === takingQuiz.fragen.length - 1;
  }

  return [
    takingQuiz,
    setTakingQuiz,
    err,
    displayError,
    {
      switchQuestion,
      getCurrentlyTakingQuestion,
      toggleAnswerToSelectedAnswers,
      submitQuestion,
      getButtonText,
    },
  ];
}

function replaceQuestion(arr, newQuestion) {
  const newArr = arr.filter((q) => q.fragenid !== newQuestion.fragenid);
  if (newArr.length !== arr.length - 1) {
    console.log(
      "question to replace in array was not found, not adding new question"
    );
    return arr;
  }
  newArr.push(newQuestion);
  return newArr.sort((a, b) => (a.pos <= b.pos ? -1 : 1));
}
