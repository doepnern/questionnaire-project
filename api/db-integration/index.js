const { initDB } = require("./initial");
const { updateQuestions } = require("./interface/updateQuestions");
const { createNewQuestion } = require("./interface/createNewQuestion");
const { deleteQuestionById } = require("./interface/deleteQuestion");
const { getQuestions } = require("./interface/getQuestions");
const { deleteTagById, findTag, createTag } = require("./interface/Tags");
const { performQuery } = require("./service/db-actions");
const { quizzesFromBenutzer } = require("./views/quizView");
const { upsertQuizSQL } = require("./interface/Quiz/upsertQuiz");
const { addQuizToUserSQL } = require("./interface/Quiz/addQuizToUser");
const { addFrageToQuizSQL } = require("./interface/Quiz/addFrageToQuiz");
const {
  removeFragenFromQuizSQL,
} = require("./interface/Quiz/removeFragenFromQuiz");
const { deleteQuizSQL } = require("./interface/Quiz/deleteQuiz");
module.exports = {
  initDB: initDB,
  updateQuestions: updateQuestions,
  createNewQuestion: createNewQuestion,
  deleteQuestionById: deleteQuestionById,
  getQuestions: getQuestions,
  deleteTagById: deleteTagById,
  findTag: findTag,
  createTag,
  performQuery,
  quizzesFromBenutzer,
  upsertQuizSQL,
  addQuizToUserSQL,
  addFrageToQuizSQL,
  removeFragenFromQuizSQL,
  deleteQuizSQL,
};
