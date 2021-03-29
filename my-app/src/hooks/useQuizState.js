import React, { useState } from "react";
import { getQuiz } from "services/UserService";
import {
  insertIfNotContained,
  removeIfContained,
} from "helpers/QuestionHelpers/QuestionStorage/questionInterface";

export function useQuizState() {
  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState({
    isEditing: false,
    quizEditing: -1,
  });

  function refreshQuizzes(userId) {
    getQuiz(userId, (res) => {
      setQuizzes(res.result[0]?.quizzes);
    });
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
// adds a question to the currently editing quiz
export function addQuestionQuiz(question) {
  return { type: ADD_QUESTION_QUIZ, value: question };
}
// adds a question from the currently editing quiz
export function deleteQuestionQuiz(question) {
  return { type: DELETE_QUESTION_QUIZ, value: question };
}

/*
 *   HELPER functions
 */

//adds a question to a quiz
function handleQuizAdding(quizzes, currentlyEditing, question) {
  if (currentlyEditing === -1) return;
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
