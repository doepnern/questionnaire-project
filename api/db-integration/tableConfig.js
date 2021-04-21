const { benutzer, fragen, benutzerfragen } = require("./testData");

const tableNames = [
  "Benutzer",
  "Fragen",
  "BenutzerFragen",
  "Tags",
  "FragenTags",
  "Quiz",
  "BenutzerQuiz",
  "QuizFragen",
];
const createTableBenutzer = `
CREATE TABLE IF NOT EXISTS ${tableNames[0]} (
    benutzerId serial NOT NULL,
    benutzername varchar NOT NULL,
    PRIMARY KEY (benutzerId)
);
`;
const createTableFragen = `
CREATE TABLE IF NOT EXISTS ${tableNames[1]} (
    fragenId serial NOT NULL,
    titel varchar NOT NULL,
    antworten varchar,
    PRIMARY KEY (fragenId)
);
`;

const createTableBenutzerfragen = `
CREATE TABLE IF NOT EXISTS ${tableNames[2]} (
    benutzerId int NOT NULL REFERENCES benutzer,
    fragenId int NOT NULL REFERENCES fragen
);
`;
const createTableTags = `
CREATE TABLE IF NOT EXISTS ${tableNames[3]} (
    tagId serial NOT NULL,
    tagName varchar NOT NULL,
    PRIMARY KEY (tagId)
);
`;
const createTableFragenTags = `
CREATE TABLE IF NOT EXISTS ${tableNames[4]} (
    fragenId int NOT NULL REFERENCES fragen,
    tagId int NOT NULL REFERENCES tags,
    UNIQUE(fragenId,tagId)
);
`;

const createTableQuiz = `
  CREATE TABLE IF NOT EXISTS ${tableNames[5]} (
  quizId serial NOT NULL,
  beendet boolean Not NULL,
  titel varchar NOT NULL,
  score varchar NOT NULL,
  progress varchar NOT NULL,
  PRIMARY KEY(quizId)
  );
`;

const createTableBenutzerQuiz = `
CREATE TABLE IF NOT EXISTS ${tableNames[6]} (
    benutzerId int NOT NULL REFERENCES benutzer,
    quizId int NOT NULL REFERENCES quiz,
    UNIQUE(benutzerId,quizId)
);
`;

const createTableQuizFragen = `
CREATE TABLE IF NOT EXISTS ${tableNames[7]} (
    quizId int NOT NULL REFERENCES quiz,
    fragenId int NOT NULL REFERENCES fragen,
    fragenPos int NOT NULL,
    beantwortet boolean NOT NULL,
    ausgewaehlteAntworten integer[] NOT NULL,
    UNIQUE(quizId,fragenId)
);
`;

const deleteQuerys = [];
tableNames.forEach((tableName) =>
  deleteQuerys.push(`DROP TABLE IF EXISTS ${tableName};`)
);
//reverse so dependencys are not a problem
deleteQuerys.reverse();

function getCreateQuerys() {
  const querys = [
    createTableBenutzer,
    createTableFragen,
    createTableBenutzerfragen,
    createTableTags,
    createTableFragenTags,
    createTableQuiz,
    createTableBenutzerQuiz,
    createTableQuizFragen,
  ];
  return querys;
}

module.exports = {
  getCreateQuerys: getCreateQuerys,
  deleteQuerys: deleteQuerys,
};
