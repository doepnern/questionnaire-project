const { isInt } = require("../my_util");
const { performQuery } = require("../db-integration/service/db-actions");
const {
  getUserInfoSQL,
} = require("../db-integration/interface/User/getUserInfo");

const {
  getQuestionsForUserSQL,
} = require("../db-integration/interface/Questions/getQuestionsForUser");

async function getQuestionsFromUser(userId, filter, limit, offset) {
  if (!isInt(userId))
    throw new Error(
      "given userId to get questions for in not a valid int " + userId
    );
  if (!typeof filter == "string")
    throw new Error(
      "filter has to be string to find questions, given:  " + filter
    );
  // get user info
  const user = await performQuery(...getUserInfoSQL(userId));
  if (user == null) throw new Error("cant find given user: " + userId);
  console.log("user " + userId + ":");
  console.log(user.rows[0]);
  //get all questions for given user
  const questions = await performQuery(
    ...getQuestionsForUserSQL(userId, filter, limit, offset)
  );
  console.log("questions for user " + userId + ":");
  console.log("numQuestions:" + questions.rowCount);
  console.log(questions.rows);
  //build user object with questions
  const userObj = {
    ...user.rows[0],
    fragen: questions.rows.map((q) => ({
      ...q,
      antworten:
        JSON.parse(q.antworten) instanceof Array ? JSON.parse(q.antworten) : [],
    })),
  };
  return userObj;
}

module.exports = {
  getQuestionsFromUser,
};
