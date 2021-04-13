const { getQuiz, upsertQuiz, deleteQuiz } = require("./quizHandler");
const { handleAddingTagToQuestion } = require("./tagHandler");
const { getQuestionsFromUser } = require("./questionHandler");
module.exports = {
  getQuiz,
  handleAddingTagToQuestion,
  upsertQuiz,
  deleteQuiz,
  getQuestionsFromUser,
};
