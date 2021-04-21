import { useState } from "react";
import {
  getQuiz,
  updateQuiz as dispatchUpdateQuiz,
} from "services/UserService";
import {
  insertIfNotContained,
  removeIfContained,
} from "helpers/QuestionHelpers/QuestionStorage/questionInterface";
import { formatAnswersFromQuestion } from "helpers/util";

export function useQuizState() {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState({
    isEditing: false,
    quizEditing: -1,
  });

  function refreshQuizzes(userId) {
    getQuiz(userId, (res) => {
      console.log(res.result[0]?.quizzes);
      setQuizzes(
        res.result[0]?.quizzes.map((q) => ({
          ...q,
          fragen: formatAnswersFromQuestion(q.fragen),
        }))
      );
    });
  }

  //updates the quizData in the db with the passed quizData, if quizId is -1, quiz is newly created, also quiz is added to userIds quizzes
  function updateQuiz(quizData, userId, callback = () => undefined) {
    dispatchUpdateQuiz(quizData, userId, (res) => {
      refreshQuizzes(userId);
      callback(res);
    });
  }

  function updateCurrentlyEditingQuiz(updatingObj = {}, userId) {
    updateQuiz(
      editingQuiz.quizEditing >= 0
        ? { ...findQuiz(quizzes, editingQuiz.quizEditing), ...updatingObj }
        : { quizid: -1, beendet: false, titel: "new quiz" },
      userId
    );
  }

  function getQuestionsInQuiz() {
    if (editingQuiz.quizEditing < 0) return [];
    const currentQuiz = findQuiz(quizzes, editingQuiz.quizEditing);
    if (currentQuiz == null) return [];
    return currentQuiz.fragen;
  }

  function dispatch(action) {
    const nextState = questionStateReducer(
      { quizzes: quizzes, currentlyEditing: editingQuiz.quizEditing },
      action
    );
    setQuizzes(nextState);
  }

  return [
    quizzes,
    setQuizzes,
    dispatch,
    refreshQuizzes,
    editingQuiz,
    setEditingQuiz,
    {
      updateQuiz,
      updateCurrentlyEditingQuiz,
      getQuestionsInQuiz,
    },
  ];
}

function questionStateReducer(state, action) {
  switch (action.type) {
    case ADD_QUESTION_QUIZ:
      return handleQuizAdding(
        state.quizzes,
        state.currentlyEditing,
        action.value
      );
    case DELETE_QUESTION_QUIZ:
      return handleDeletingQuestion(
        state.quizzes,
        state.currentlyEditing,
        action.value
      );
    default:
      return [...state.quizzes];
  }
}

//available actions
const ADD_QUESTION_QUIZ = "addQuestion";
const DELETE_QUESTION_QUIZ = "deleteQuestion";
const UPDATE_QUIZ = "updateQuiz";
// adds a question to the currently editing quiz
export function addQuestionQuiz(question) {
  return { type: ADD_QUESTION_QUIZ, value: question };
}
// adds a question from the currently editing quiz
export function deleteQuestionQuiz(question) {
  return { type: DELETE_QUESTION_QUIZ, value: question };
}

export function updateQuiz(quiz, user) {
  return { type: UPDATE_QUIZ, value: { quiz, user } };
}

/*
 *   HELPER functions
 */

//adds a question to a quiz
function handleQuizAdding(quizzes, currentlyEditing, question) {
  if (currentlyEditing === -1) return quizzes;
  let currentQuiz = findQuiz(quizzes, currentlyEditing);
  return replaceQuizWithId(quizzes, {
    ...currentQuiz,
    fragen: insertIfNotContained(currentQuiz.fragen, question),
  });
}

//deletes given question from currently editing quiz
function handleDeletingQuestion(quizzes, currentlyEditing, question) {
  if (question == null) return;
  let currentQuiz = findQuiz(quizzes, currentlyEditing);
  return replaceQuizWithId(quizzes, {
    ...currentQuiz,
    fragen: removeIfContained(currentQuiz.fragen, question),
  });
}

function findQuiz(arr, quizid) {
  return arr.find((e) => e.quizid === quizid);
}
function replaceQuizWithId(arr, quiz) {
  let target = arr.findIndex((e) => e.quizid === quiz.quizid);
  if (target < 0) return [...arr];
  return [...arr.slice(0, target), quiz, ...arr.slice(target + 1)];
}
