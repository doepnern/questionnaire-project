const { questionsWithTags } = require("./benutzerFragen");
function quizzesFromBenutzer(benutzerId) {
  query = ` 
  SELECT currBenutzer.benutzerid, currBenutzer.benutzername, json_agg(json_build_object('quizid',fullQuiz.quizid,'beendet',fullQuiz.beendet,'fragen',fullQuiz.fragen)) FILTER (WHERE fullQuiz.quizId IS NOT NULL) as quizzes
  FROM (SELECT * FROM benutzer ${
    benutzerId ? "WHERE benutzer.benutzerid = $1 " : ""
  }) as currBenutzer
  LEFT JOIN benutzerQuiz ON currBenutzer.benutzerId = benutzerQuiz.benutzerid 
  LEFT JOIN (${
    quizWithQuestions()[0]
  }) as fullQuiz ON fullQuiz.quizid = benutzerQuiz.quizId
  GROUP BY currBenutzer.benutzerid, currBenutzer.benutzername
`;
  params = benutzerId ? [benutzerId] : [];
  return [query, params];
}

function quizWithQuestions() {
  query = `
  SELECT quiz.quizid, quiz.beendet, json_agg(
    json_build_object('fragenid',questionsWithTags.fragenid,'titel',questionsWithTags.titel,'antworten',questionsWithTags.antworten,'tags', questionsWithTags.tags) ORDER BY questionsWithTags.fragenid ASC) 
    FILTER (WHERE questionsWithTags.fragenid IS NOT null) as fragen
  FROM quiz
  LEFT JOIN quizFragen ON quiz.quizid = quizFragen.quizid
  LEFT JOIN (${
    questionsWithTags()[0]
  }) as questionsWithTags ON quizFragen.fragenid = questionsWithTags.fragenid
  GROUP BY quiz.quizid
  `;
  return [query, []];
}

module.exports = {
  quizzesFromBenutzer,
  questionsWithTags,
  quizWithQuestions,
};
