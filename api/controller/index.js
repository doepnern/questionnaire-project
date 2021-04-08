const { getQuiz, upsertQuiz } = require("./quizHandler");
const { handleAddingTagToQuestion } = require("./tagHandler");
module.exports = {
  getQuiz,
  handleAddingTagToQuestion,
  upsertQuiz,
};
