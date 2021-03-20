const { performQuery } = require("../service/db-actions");

//adds question for specified user
async function deleteQuestionById(questionId) {
  //see if questionId is valid int
  if (!isNaN(parseInt(questionId))) {
    let res = await performQuery([
      [...deleteQuestionFragenTags(questionId)],
      [...deleteQuestionBenutzerFragen(questionId)],
      [...deleteQuestionSQL(questionId)],
    ]);
    return res;
  } else {
    return {
      error:
        "question could not be deleted, please specify a valid questionId of type int",
    };
  }
}

function deleteQuestionSQL(questionId) {
  const query = `DELETE FROM Fragen 
                 WHERE Fragen.fragenid = $1
                `;
  const params = [questionId];
  return [query, params];
}

function deleteQuestionBenutzerFragen(questionId) {
  const query = `DELETE FROM BenutzerFragen 
                 WHERE BenutzerFragen.fragenid = $1
                `;
  const params = [questionId];
  return [query, params];
}

function deleteQuestionFragenTags(questionId) {
  const query = `DELETE FROM fragentags 
                 WHERE fragentags.fragenid = $1
                `;
  const params = [questionId];
  return [query, params];
}

module.exports = {
  deleteQuestionById: deleteQuestionById,
};
