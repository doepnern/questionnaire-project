const { getQuiz, upsertQuiz, deleteQuiz } = require("./quizHandler");
const { handleAddingTagToQuestion } = require("./tagHandler");
module.exports = {
  getQuiz,
  handleAddingTagToQuestion,
  upsertQuiz,
  deleteQuiz,
};
