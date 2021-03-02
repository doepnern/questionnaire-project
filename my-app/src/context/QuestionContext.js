import React, { useReducer } from "react";
import { useContext } from "react";
import qh, { KeepHistory } from "helpers/QuestionHistory/questionHistory.js";
import _ from "lodash";

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
  let oldQuestions = _.cloneDeep(state.questions);
  switch (action.type) {
    case UPDATE_QUESTION:
      //find question with right id
      let oldQuestion = findById(oldQuestions, action.question, "fragenid");
      const changed = updateQuestionKeys(oldQuestion.o, action.question);
      if (changed) {
        return handleAddingHistory({
          ...state,
          changed: !state.changed,
          questions: oldQuestions,
        });
      } else {
        return { ...state };
      }
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
  console.log("comparing objects: ");
  console.log(target);
  console.log(source);
  console.log("equal: " + _.isEqual(target, source));
  let changed = false;
  const targetKeys = Object.keys(target);
  for (let key of Object.keys(source)) {
    // if target has the same key, add its value
    if (targetKeys.includes(key)) {
      //if they have the same value, dont do anything and only set changed to true if at leas one value was changed
      if (!_.isEqual(target[key], source[key])) {
        target[key] = source[key];
        changed = true;
      }
    }
  }
  if (!changed) {
    console.log("nothing changed");
  }
  return changed;
}

//adds the new state to history
function handleAddingHistory(s) {
  const oldHistory = new KeepHistory(s.history);
  const newQuestions = _.cloneDeep(s.questions);
  setAllToOld(newQuestions);
  oldHistory.addToHistory({ q: newQuestions });
  return { ...s, history: oldHistory };
}

//sets the new key of all answers to old so they are not displayed in editing
function setAllToOld(questions) {
  for (let q of questions) {
    for (let a of q.antworten) {
      if (a?.new) {
        a.new = false;
      }
    }
  }
}
