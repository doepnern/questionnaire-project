function deleteQuizSQL(quizid) {
  const querys = [];
  querys.push(deleteUserQuiz(quizid));
  querys.push(deleteQuizFragen(quizid));
  querys.push(deleteQuiz(quizid));
  return querys;
}

function deleteUserQuiz(quizid) {
  const query = `DELETE FROM benutzerQuiz WHERE quizid = $1`;
  const params = [quizid];
  return [query, params];
}
function deleteQuizFragen(quizid) {
  const query = `DELETE FROM quizFragen WHERE quizid = $1`;
  const params = [quizid];
  return [query, params];
}
function deleteQuiz(quizid) {
  const query = `DELETE FROM quiz WHERE quizid = $1`;
  const params = [quizid];
  return [query, params];
}
module.exports = {
  deleteQuizSQL,
};
