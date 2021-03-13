const { getUserView } = require("../db-integration");

async function getUserQuestions(id) {
  console.log("get users called with id:" + id);
  return getUserView(id).then((ret) => {
    return ret;
  });
}

//returns only questions filtered by given string
async function getQuestionsFilter(id, filterString) {}

module.exports = {
  getUserQuestions: getUserQuestions,
};
