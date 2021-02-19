const { performQuery } = require("../db-actions");

//adds question for specified user
async function createNewQuestion(userId) {
  //see if userid is valid int
  if (!isNaN(parseInt(userId))) {
    let res = await performQuery(...addQuestionSQL(userId));
    if (!res.error)
      performQuery(...addQuestionToUser(userId, res.rows[0].fragenid));
    return res;
  } else {
    return {
      error:
        "question could not be added, please specify a valid userId of type int",
    };
  }
}

function addQuestionSQL() {
  const query = `INSERT INTO Fragen 
                 VALUES (DEFAULT,
                 'new question',
                  null)
                  RETURNING fragenid
                `;
  const params = [];
  return [query, params];
}

function addQuestionToUser(userId, fragenId) {
  const query = `INSERT INTO benutzerFragen 
                 VALUES ($1,
                 $2
                  )
                `;
  const params = [userId, fragenId];
  return [query, params];
}

module.exports = {
  createNewQuestion: createNewQuestion,
};
