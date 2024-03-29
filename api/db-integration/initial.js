const { getCreateQuerys, deleteQuerys } = require("./tableConfig");
const dbActions = require("./service/db-actions");
const { performQuery } = require("./service/db-actions");
const testData = require("./testData");

function initDB() {
  console.log("initializibg");
  //create all needed tables
  const createQuerys = getCreateQuerys();
  performQuery(deleteQuerys)
    .then(() => performQuery(createQuerys))
    .then(() =>
      performQuery(dbActions.insertInto("benutzer", testData.benutzer))
    )
    .then(() => performQuery(dbActions.insertInto("Fragen", testData.fragen)))
    .then(() =>
      performQuery(
        dbActions.insertInto("benutzerFragen", testData.benutzerfragen)
      )
    )
    .then(() => performQuery(dbActions.insertInto("tags", testData.tags)))
    .then(() =>
      performQuery(dbActions.insertInto("fragenTags", testData.fragenTags))
    )
    .then(() => performQuery(dbActions.insertInto("quiz", testData.quiz)))
    .then(() =>
      performQuery(dbActions.insertInto("benutzerQuiz", testData.benutzerQuiz))
    )
    .then(() =>
      performQuery(dbActions.insertInto("quizFragen", testData.QuizFragen))
    );
  //.then(() => getQuestionsFromUser(1, "men", 10, 0));
  //.then((res) => console.log(JSON.stringify(res.rows, null, 3)));
}

module.exports = {
  initDB: initDB,
};
