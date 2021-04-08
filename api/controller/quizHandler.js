const {
  performQuery,
  quizzesFromBenutzer,
  upsertQuizSQL,
  addQuizToUserSQL,
  addFrageToQuizSQL,
  removeFragenFromQuizSQL,
} = require("../db-integration");
async function getQuiz(userId) {
  const res = await performQuery(...quizzesFromBenutzer(userId));
  if (!res.error) {
    //replace null for fragen with empty array
    res.rows.forEach((r) => {
      removeNulls(r, "quizzes");
      r.quizzes.forEach((q) => removeNulls(q, "fragen"));
    });
    return res.rows;
  } else
    throw new Error(
      "error getting Quiz for user: " + userId + ", message: " + res.error
    );
}

async function upsertQuiz(quizData) {
  const res = [await performQuery(...upsertQuizSQL(quizData))];
  //add quiz to user if it isnt already added
  if (!(res[0].rows[0] && res[0].rows[0].quizid)) return res;
  const quizAdded = res[0].rows[0].quizid;
  if (quizData.benutzerId)
    res.push(
      await performQuery(...addQuizToUserSQL(quizData.benutzerId, quizAdded))
    );

  if (quizData.fragen && quizData.fragen instanceof Array) {
    //reomve all questions from quiz
    res.push(await performQuery(...removeFragenFromQuizSQL(quizAdded)));
    //add all questions given
    for (let q of quizData.fragen) {
      if (q && q.fragenid) {
        res.push(
          await performQuery(...addFrageToQuizSQL(q.fragenid, q.pos, quizAdded))
        );
      }
    }
  }
  return res;
}

function removeNulls(obj, key) {
  if (obj[key] == null) obj[key] = [];
}
module.exports = {
  getQuiz,
  upsertQuiz,
};
