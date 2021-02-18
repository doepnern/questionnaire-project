import React, { useReducer } from "react";
import { useContext } from "react";
import qh, { KeepHistory } from "helpers/QuestionHistory/questionHistory.js";

export const QuestionContext = React.createContext();

const initialState = {
  questions: [],
  detailView: {
    isOpen: false,
    questionOpened: 0,
  },
  changed: false,
  history: new qh.KeepHistory(),
};

//actions
const ADD_QUESTION = "addQuestion";
const UPDATE_QUESTION = "updateQuestion";
const DELETE_QUESTION = "deleteQuestion";
const UNDO = "undo";
const REDO = "redo";
const CLEAR_HISTORY = "clearHistory";

function updateQuestion(question) {
  return { type: UPDATE_QUESTION, question };
}
/* adds a question to the questions array, if array is given, replaces the queations array */
function addQuestion(questions) {
  if (questions instanceof Array) {
    return { type: "replaceArray", questions };
  } else {
    return { type: ADD_QUESTION, questions };
  }
}
function deleteQuestion(question) {
  return { type: DELETE_QUESTION, question };
}
function undo() {
  return { type: UNDO };
}
function redo() {
  return { type: REDO };
}
function clearHistory() {
  return { type: CLEAR_HISTORY };
}

//Reducer function
function QuestionContextReducer(state, action) {
  console.log(state);
  let oldQuestions = [...state.questions];
  switch (action.type) {
    case UPDATE_QUESTION:
      //find question qith right id
      let oldQuestion = findById(oldQuestions, action.question, "fragenid");
      console.log("new answers:");
      console.log(action.question);
      updateQuestionKeys(oldQuestion.o, action.question);
      return handleAddingHistory({
        ...state,
        changed: !state.changed,
        questions: oldQuestions,
      });
    case DELETE_QUESTION:
      removeIfIncluded(oldQuestions, action.question);
      return handleAddingHistory({
        ...state,
        changed: !state.changed,
        questions: oldQuestions,
      });
    case "replaceArray":
      return handleAddingHistory({
        ...state,
        questions: action.questions,
        changed: !state.changed,
      });
    case ADD_QUESTION:
      //check if question is already added
      let alreadyExists = findById(oldQuestions, action.questions, "fragenid");
      if (alreadyExists) {
        console.log(
          "The question you tried to add already exists in the context"
        );
        console.log(action.questions);
        return { ...state, changed: !state.changed };
      } else {
        oldQuestions.push(action.questions);
        return handleAddingHistory({
          ...state,
          changed: !state.changed,
          questions: oldQuestions,
        });
      }
    case UNDO:
      const kh = new KeepHistory(state.history);
      const back = kh.travelBack();
      if (back == null) {
        console.log("cant undo this far");
        return { ...state };
      }
      return {
        ...state,
        questions: back.q,
        changed: !state.changed,
        history: kh,
      };
    case REDO:
      const hist1 = new KeepHistory(state.history);
      const to = hist1.travel(1);
      if (to == null) {
        console.log("cant redo this far");
        return { ...state };
      }
      return {
        ...state,
        questions: to.q,
        changed: !state.changed,
        history: hist1,
      };
    case CLEAR_HISTORY:
      const newH = new KeepHistory();
      newH.addToHistory({ q: state.questions });
      return { ...state, history: newH, changed: !state.changed };
    default:
      return { ...state };
  }
}

function QuestionContextProvider(props) {
  const [questionContext, dispatch] = useReducer(
    QuestionContextReducer,
    initialState
  );
  const value = { questionContext, dispatch };
  return <QuestionContext.Provider value={value} {...props} />;
}

function useQuestionContext() {
  return useContext(QuestionContext);
}

export {
  useQuestionContext,
  QuestionContextProvider,
  updateQuestion,
  addQuestion,
  deleteQuestion,
  undo,
  redo,
  clearHistory,
};

/**
 *
 *  Helper functions
 */

function removeIfIncluded(questionArray, question) {
  let oldQuestion = findById(questionArray, question, "fragenid");
  if (oldQuestion) {
    questionArray.splice(oldQuestion.index, 1);
  }
}

//find obj with same idName value as obj.idName in list and return its index
function findById(list, obj, idName) {
  if (idName === null || idName === undefined) {
    return undefined;
  }
  let index = 0;
  for (let o of list) {
    if (o[idName] === obj[idName]) {
      return { index, o };
    }
    index++;
  }
  return undefined;
}

function updateQuestionKeys(target, source) {
  const targetKeys = Object.keys(target);
  for (let key of Object.keys(source)) {
    // if target has the same key, add its value
    if (targetKeys.includes(key)) {
      target[key] = source[key];
    }
  }
}

//adds the new state to history
function handleAddingHistory(s) {
  const oldHistory = new KeepHistory(s.history);
  const newQuestions = s.questions;
  oldHistory.addToHistory({ q: newQuestions });
  return { ...s, history: oldHistory };
}
