const { performQuery } = require("../db-actions");

function updateQuestions(questions) {
  for (let q of questions) {
    //see if question has valid id
    if (parseInt(questions.fragenid) !== NaN) {
      performQuery(...updateQuestionSQL(q));
    } else {
      throw "fragenid was not a valid integer";
    }
  }
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
