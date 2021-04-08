const { isInt } = require("../../../my_util");

function addFrageToQuizSQL(fragenId, fragenPos, quizId) {
  if (!isInt(fragenId) || !isInt(quizId) || !isInt(fragenPos))
    throw new Error(
      "fragenId and quizId has to be int, in order to add question to quiz given was fragenId " +
        fragenId +
        ", quizId " +
        quizId
    );
  const query = `INSERT INTO quizFragen
                   VALUES($1,$2,$3) 
                `;
  const params = [quizId, fragenId, fragenPos];
  return [query, params];
}

module.exports = {
  addFrageToQuizSQL,
};
