const { performQuery, quizzesFromBenutzer } = require("../db-integration");
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

function removeNulls(obj, key) {
  if (obj[key] == null) obj[key] = [];
}
module.exports = {
  getQuiz,
};
