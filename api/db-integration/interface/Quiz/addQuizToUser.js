const { isInt } = require("../../../my_util");

function addQuizToUserSQL(userId, quizId) {
  if (!isInt(userId) || !isInt(quizId))
    throw new Error(
      "benutzerId and quizId has to be int, in order to add quiz to user given was userid" +
        userId +
        ", quizId " +
        quizId
    );
  const query = `INSERT INTO benutzerQuiz
                   VALUES($1,$2) 
                `;
  const params = [userId, quizId];
  return [query, params];
}
module.exports = {
  addQuizToUserSQL,
};
