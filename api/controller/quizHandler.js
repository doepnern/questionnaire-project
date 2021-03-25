const { performQuery, quizzesFromBenutzer } = require("../db-integration");
async function getQuiz(userId) {
  const res = await performQuery(...quizzesFromBenutzer(userId));
  if (!res.error) {
    return res.rows;
  } else
    throw new Error(
      "error getting Quiz for user: " + userId + ", message: " + res.error
    );
}
module.exports = {
  getQuiz,
};
