const { isInt } = require("../../../my_util/index");
function removeFragenFromQuizSQL(quizId) {
  if (!isInt(quizId))
    throw new Error(
      "quizId has to be int, in order to remove all questions from quiz, given was quizid " +
        quizId
    );
  const query = `DELETE FROM quizFragen WHERE quizId = $1
                `;
  const params = [quizId];
  return [query, params];
}
module.exports = {
  removeFragenFromQuizSQL,
};
