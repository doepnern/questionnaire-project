const qh = require("./../QuestionHistory/questionHistory");
const qi = require("./questionInterface");
const _ = require("lodash");
/**
 * Handles storing and updating of questions
 *
 *
 * functions:
 *  //adds question and makes sure given question is in valid format for a question
 *  +addQuestion(question)
 *  //wont need removeQuestion, will just be rebuild when question is deleted from db
 *  //updates Question, if change is reported, adds the question to history
 *  +updateQuestion(id,{type: updateQestion | addAnswer | updateAnswer | removeAnswer, value: any})
 *  //returns all questions currently saved
 *  +getQuestions() :: [questions]
 *  //undoes last change -> only for individual questions being edited
 *  +undo()
 *  //redoes last undo only for individual questions being edited
 *  +redo()
 */

//creates new Question Storage, if an old storage is given, creates a new Storage with a deef copy of the old storage
function QuestionStorage(oldStorage) {
  if (oldStorage == null) {
    this.questions = [];
    this.history = new qh.KeepHistory();
  } else {
    this.questions = _.cloneDeep(oldStorage.questions);
    this.history = new qh.KeepHistory(oldStorage.history);
  }
}

function addQuestion(question) {
  let answers = new qi.createQuestion(1).antworten;
  //remove additional keys from answers
  if (question.hasOwnProperty("antworten")) {
    answers = question.antworten.map((answer) => {
      const k = qi.keysInBoth(answer, qi.typesAnswer);
      const newAnswer = {};
      k.forEach((key) => (newAnswer[key] = answer[key]));
      return newAnswer;
    });
  }
  const q = qi.questionFromObject({ ...question, antworten: answers });
  this.questions.push(q.obj);
}

function replaceQuestion(fragenid, question) {
  const q = this.findQuestionById(fragenid);
  //replace question by index
  const newQuestions = [
    ...this.questions.slice(0, q.index),
    question,
    ...this.questions.slice(q.index + 1),
  ];
  this.questions = newQuestions;
}

function getQuestions() {
  return this.questions;
}

function updateQuestion(fragenid, action) {
  const q = this.findQuestionById(fragenid);
  // if history is empty, save state before updating
  if (!this.history.canTravelBackward() && !this.history.canTravelForward())
    this.history.addToHistory(this.getQuestions());
  //perform Action on question
  switch (action.type) {
    case UPDATE_QUESTION:
      let newQ1 = qi.updateQuestion(q.q, action.updatingQuestion);
      this.replaceQuestion(fragenid, newQ1.obj);
      //only add to history if something changed
      if (newQ1.changes > 0) this.history.addToHistory(this.getQuestions());
      break;
    case ADD_ANSWER:
      this.replaceQuestion(fragenid, qi.addAnswer(q.q).obj);
      this.history.addToHistory(this.getQuestions());
      break;
    case REMOVE_ANSWER:
      this.replaceQuestion(fragenid, qi.deleteAnswer(q.q, action.value).obj);
      this.history.addToHistory(this.getQuestions());
      break;
    case UPDATE_ANSWER:
      let newQ = qi.updateAnswer(q.q, action.value.index, action.value.answer);
      this.replaceQuestion(fragenid, newQ.obj);
      //only add to history if something changed
      if (newQ.changes > 0) this.history.addToHistory(this.getQuestions());
      break;
    default:
      return;
  }
}

//finds first appearance of question with fragenid === fragenid
function findQuestionById(fragenid) {
  if (!qi.isInt(fragenid))
    throw "need to provide valid fragenid to find question";
  //find right question
  let id = parseInt(fragenid);
  let index = 0;
  for (let question of this.questions) {
    if (question.fragenid === id) {
      return { q: question, index: index };
    }
    index++;
  }
  throw "couldnt find question with fitting id";
}

/**
 * ACTIONS
 */
const ADD_ANSWER = "addAnswer";
const REMOVE_ANSWER = "removeAnswer";
const UPDATE_ANSWER = "updateAnswer";
const UPDATE_QUESTION = "updateQuestion";

function addAnswer() {
  return { type: ADD_ANSWER };
}

function removeAnswer(index) {
  return { type: REMOVE_ANSWER, value: index };
}

function updateAnswer(index, answer) {
  return { type: UPDATE_ANSWER, value: { index: index, answer: answer } };
}
function updateQuestionStorage(updatingQuestion) {
  return { type: UPDATE_QUESTION, updatingQuestion: updatingQuestion };
}

QuestionStorage.prototype.addQuestion = addQuestion;
QuestionStorage.prototype.getQuestions = getQuestions;
QuestionStorage.prototype.updateQuestion = updateQuestion;
QuestionStorage.prototype.replaceQuestion = replaceQuestion;
QuestionStorage.prototype.findQuestionById = findQuestionById;
QuestionStorage.prototype.travelBack = function () {
  const historicQuestions = this.history.travelBack();
  if (historicQuestions == null) throw "cant go back to this point in time";
  this.questions = historicQuestions;
};
QuestionStorage.prototype.travelForward = function () {
  const historicQuestions = this.history.travel(1);
  if (historicQuestions == null) throw "cant go forward to this point in time";
  this.questions = historicQuestions;
};
QuestionStorage.prototype.canTravelBackward = function () {
  return this.history.canTravelBackward();
};
QuestionStorage.prototype.canTravelForward = function () {
  return this.history.canTravelForward();
};
QuestionStorage.prototype.clearHistory = function () {
  this.history = new qh.KeepHistory();
};

module.exports = {
  QuestionStorage: QuestionStorage,
  addAnswer: addAnswer,
  removeAnswer: removeAnswer,
  updateAnswer: updateAnswer,
  updateQuestionStorage: updateQuestionStorage,
};
