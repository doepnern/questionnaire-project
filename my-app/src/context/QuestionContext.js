import React, { useReducer } from "react";
import { useContext } from "react";
import {
  QuestionStorage,
  addAnswer,
  removeAnswer,
  updateAnswer,
} from "helpers/QuestionHelpers/QuestionStorage/QuestionStorage";
import _ from "lodash";

export const QuestionContext = React.createContext();

const initialState = {
  questions: [],
  detailView: {
    isOpen: false,
    questionOpened: 0,
  },
  changed: false,
  QuestionStorage: new QuestionStorage(),
  newAnswer: false,
};

//actions
const ADD_QUESTION = "addQuestion";
const UPDATE_QUESTION = "updateQuestion";
const UNDO = "undo";
const REDO = "redo";
const CLEAR_HISTORY = "clearHistory";
/**
 *
 * question = {
 * fragenid: int
 * titel: String
 * antworten: [{}]
 * tags: [{}]
 * }
 */

//updates question with same id, overrides all defined values
function updateQuestion(fragenid, action) {
  return { type: UPDATE_QUESTION, fragenid, action };
}
/* adds a question to the questions array, if array is given, replaces the queations array */
function addQuestion(questions) {
  if (questions instanceof Array) {
    return { type: "replaceArray", questions };
  } else {
    return { type: ADD_QUESTION, questions };
  }
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
  let newQs = new QuestionStorage(state.QuestionStorage);
  let newAnswer = false;
  switch (action.type) {
    case UPDATE_QUESTION:
      try {
        newQs.updateQuestion(action.fragenid, action.action);
      } catch (e) {
        console.log("error: " + e);
        console.log("error: " + e.stack);
      }
      if (action.action.type === "addAnswer") {
        newAnswer = true;
      }
      break;
    case "replaceArray":
      newQs = new QuestionStorage();
      for (let q of action.questions) {
        try {
          newQs.addQuestion(q);
        } catch (e) {
          console.log("error: " + e);
          console.log(e.stack);
        }
      }
      break;
    case ADD_QUESTION:
      try {
        newQs.addQuestion(action.questions);
      } catch (e) {
        console.log("error: " + e);
      }
      break;
    case UNDO:
      try {
        newQs.travelBack();
      } catch (e) {
        console.log("error: " + e);
      }
      break;
    case REDO:
      try {
        newQs.travelForward();
      } catch (e) {
        console.log("error: " + e);
      }
      break;
    case CLEAR_HISTORY:
      try {
        newQs.clearHistory();
      } catch (e) {
        console.log("error: " + e);
      }
      break;
  }
  return {
    ...state,
    questions: newQs.getQuestions(),
    changed: !state.changed,
    QuestionStorage: newQs,
    newAnswer: newAnswer,
  };
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
  undo,
  redo,
  clearHistory,
};

/**
 *
 *  Helper functions
 */
