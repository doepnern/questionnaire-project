const { isInt } = require("../../../my_util/index");

function upsertQuizSQL(quizData) {
  //if quizId is -1, create new quiz
  if (!isInt(quizData.quizid)) {
    throw new Error(
      "quizid has to be int, quizid given was " + quizData.quizid
    );
  }
  const query = `
  INSERT INTO quiz
  VALUES(${parseInt(quizData.quizid) > -1 ? "$1" : "DEFAULT"},$2,$3)
  ON CONFLICT (quizid) DO UPDATE SET (beendet,titel)=($2,$3) WHERE quiz.quizid = $1 RETURNING quizId;
  `;
  const params = [
    isInt(quizData.quizid) ? quizData.quizid : -1,
    quizData.beendet,
    quizData.titel,
  ];
  return [query, params];
}

module.exports = {
  upsertQuizSQL,
};
