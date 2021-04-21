import { getQuiz, updateQuiz } from "services/UserService";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { formatQuizResult } from "helpers/util";

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
            const quizFromDB = formatQuizResult(
              findCurrentQuiz(res.result[0].quizzes, takingQuizId)
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
      //finish quiz, if succsessfull return to quizzes
      syncDbToQuiz(
        {
          ...takingQuiz,
          beendet: true,
          score: calcQuizResult(),
          progress: "100%",
        },
        () => history.push("/quiz")
      );
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
    if (question.beantwortet) return nextQuestion();
    setTakingQuiz((tq) => {
      const newState = {
        ...tq,
        fragen: replaceQuestion(tq.fragen, { ...question, beantwortet: true }),
      };
      return syncDbToQuiz({ ...newState, progress: calcProgress(newState) });
    });
  }

  function syncDbToQuiz(newObj, callback = () => undefined) {
    if (newObj?.quizid && parseInt(newObj.quizid) > -1) {
      updateQuiz(newObj, 1, callback, (res) =>
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

  function calcProgress(state = takingQuiz) {
    //divide total answers by answered answers
    const totalAnswer = state.fragen.length;
    const beantwortet = state.fragen.filter((q) => q.beantwortet).length;
    return beantwortet === 0
      ? totalAnswer === 0
        ? "100%"
        : "0%"
      : `${((beantwortet / totalAnswer) * 100).toFixed(2)}%`;
  }
  //every correctly answered question gives 1 point, every missed wrongly selected answer gives -1 point, max is total number of correct answers
  function calcQuizResult() {
    const maxPoints = getMaxPoints(takingQuiz.fragen);
    return `${getAnswerScore(takingQuiz.fragen)}/${maxPoints}`;
    function getMaxPoints(fragenArr) {
      //get number of correct answers per question and add for all questions
      return fragenArr.reduce(
        (acc, cur) =>
          acc + filterAnswers(cur.antworten, (a) => a.correct).length,
        0
      );
    }

    function getAnswerScore(questionArr) {
      if (!questionArr instanceof Array) return 0;
      //per question get selected answeres and see which of them are also in the correct array. Then substract 1 point for each selected answer not in the correct array
      let correctAnswered = 0;
      let wrongAnswered = 0;
      for (let q of questionArr) {
        const selectedIds = q.ausgewaehlteAntworten;
        const correctIds = filterAnswers(q.antworten, (a) => a.correct);
        correctAnswered =
          correctAnswered +
          selectedIds.filter((s) => correctIds.includes(s)).length;
        wrongAnswered =
          wrongAnswered +
          selectedIds.filter((s) => !correctIds.includes(s)).length;
      }
      const result = correctAnswered - wrongAnswered;
      console.log({ correctAnswered, wrongAnswered });
      return result < 1 ? 0 : result;
    }
    function filterAnswers(answerArr, filter) {
      return answerArr ? answerArr.filter(filter).map((a) => a.id) : [];
    }
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
