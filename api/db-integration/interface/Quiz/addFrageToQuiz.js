const { isInt } = require("../../../my_util");

function addFrageToQuizSQL(fragenId, frage, quizId) {
  if (!isInt(fragenId) || !isInt(quizId) || !frage)
    throw new Error(
      "fragenId and quizId has to be int, in order to add question to quiz given was fragenId " +
        fragenId +
        ", quizId " +
        quizId +
        " additional questionInfos: " +
        JSON.stringify(frage, null, 1)
    );
  const query = `INSERT INTO quizFragen
                   VALUES($1,$2,$3,$4, '{${
                     frage.ausgewaehlteAntworten
                       ? frage.ausgewaehlteAntworten.join(",")
                       : ""
                   }}') 
                `;
  const params = [
    quizId,
    fragenId,
    isInt(frage.pos) ? frage.pos : fragenId,
    frage.beantwortet ? frage.beantwortet : false,
  ];
  return [query, params];
}

module.exports = {
  addFrageToQuizSQL,
};
