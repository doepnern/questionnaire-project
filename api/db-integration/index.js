const getRequests = require("./interface/getRequests");
const { initDB } = require("./initial");
const { updateQuestions } = require("./interface/updateQuestions");
module.exports = {
  getUserView: getRequests.performGetBenutzerfragenView,
  initDB: initDB,
  updateQuestions: updateQuestions,
};
