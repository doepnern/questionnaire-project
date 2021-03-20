const { performGetBenutzerfragenView } = require("../service/getRequests");
const { isInt } = require("../../my_util");

//gets the questions of user with id, if given only returns results matching filter
async function getQuestions(id = -1, filter = "") {
  //check if filter is valid string
  if (!typeof filter == "string" || !isInt(id))
    throw new Error(
      "filter has to be string and id has to be int filter: " +
        filter +
        " id: " +
        id
    );
  console.log("get users called with id:" + id);
  return performGetBenutzerfragenView(id, filter).then((ret) => {
    return ret;
  });
}

module.exports = {
  getQuestions: getQuestions,
};
