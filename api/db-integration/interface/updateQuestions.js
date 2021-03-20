const { performQuery } = require("../service/db-actions");

// updates each question in given array
async function updateQuestions(questions) {
  //TODO: allow single question ->check for correct format before inserting
  if (!questions instanceof Array)
    throw new Error("questions was no array " + questions);
  const results = [];
  for (let q of questions) {
    //see if question has valid id
    if (parseInt(questions.fragenid) !== NaN) {
      results.push(await performQuery(...updateQuestionSQL(q)));
    } else {
      throw new Error("fragenid was not a valid integer, " + question.fragenid);
    }
  }
  return results;
}

function updateQuestionSQL(question) {
  const query = `UPDATE Fragen 
                    SET titel = $2, 
                    antworten = $3
                    WHERE Fragen.fragenid = $1`;
  const params = [
    question.fragenid,
    question.titel,
    JSON.stringify(question.antworten),
  ];
  return [query, params];
}

module.exports = {
  updateQuestions: updateQuestions,
};
