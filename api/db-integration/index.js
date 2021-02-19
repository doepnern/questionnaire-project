const getRequests = require("./interface/getRequests");
const { initDB } = require("./initial");
const { updateQuestions } = require("./interface/updateQuestions");
const { createNewQuestion } = require("./interface/createNewQuestion");
const { deleteQuestionById } = require("./interface/deleteQuestion");
module.exports = {
  getUserView: getRequests.performGetBenutzerfragenView,
  initDB: initDB,
  updateQuestions: updateQuestions,
  createNewQuestion: createNewQuestion,
  deleteQuestionById: deleteQuestionById,
};
