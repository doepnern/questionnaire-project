const { benutzer, fragen, benutzerfragen } = require("./testData");

const tableNames = [
  "Benutzer",
  "Fragen",
  "BenutzerFragen",
  "Tags",
  "FragenTags",
];
const createTableBenutzer = `
CREATE TABLE ${tableNames[0]} (
    benutzerId serial NOT NULL,
    benutzername varchar NOT NULL,
    PRIMARY KEY (benutzerId)
);
`;
const createTableFragen = `
CREATE TABLE ${tableNames[1]} (
    fragenId serial NOT NULL,
    titel varchar NOT NULL,
    antworten varchar,
    PRIMARY KEY (fragenId)
);
`;

const createTableBenutzerfragen = `
CREATE TABLE ${tableNames[2]} (
    benutzerId int NOT NULL REFERENCES benutzer,
    fragenId int NOT NULL REFERENCES fragen
);
`;
const createTableTags = `
CREATE TABLE ${tableNames[3]} (
    tagId serial NOT NULL,
    tagName varchar NOT NULL,
    PRIMARY KEY (tagId)
);
`;
const createTableFragenTags = `
CREATE TABLE ${tableNames[4]} (
    fragenId int NOT NULL REFERENCES fragen,
    tagId int NOT NULL REFERENCES tags
);
`;

const deleteQuerys = [];
tableNames.forEach((tableName) =>
  deleteQuerys.push(`drop table ${tableName};`)
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
  ];
  return querys;
}

module.exports = {
  getCreateQuerys: getCreateQuerys,
  deleteQuerys: deleteQuerys,
};
