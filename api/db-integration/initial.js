const { getCreateQuerys, deleteQuerys } = require("./tableConfig");
const dbActions = require("./db-actions");
const { performQuery } = require("./db-actions");
const testData = require("./testData");
const {
  getBenutzerFragenView,
  getBenutzerFragenViewAggregate,
} = require("./views/benutzerFragen");

function initDB() {
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
    .then(() => performQuery(getBenutzerFragenViewAggregate()));
}

module.exports = {
  initDB: initDB,
};
