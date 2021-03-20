const { initDB } = require("./initial");
const { updateQuestions } = require("./interface/updateQuestions");
const { createNewQuestion } = require("./interface/createNewQuestion");
const { deleteQuestionById } = require("./interface/deleteQuestion");
const { getQuestions } = require("./interface/getQuestions");
const { deleteTagById, findTag, createTag } = require("./interface/Tags");
const { performQuery } = require("./service/db-actions");
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
};
