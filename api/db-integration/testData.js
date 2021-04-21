const benutzer = [
  { id: "DEFAULT", benutzername: `'master'` },
  { id: "DEFAULT", benutzername: `'second User'` },
  { id: "DEFAULT", benutzername: `'third User'` },
  { id: "DEFAULT", benutzername: `'second User'` },
];
const fragen = [
  {
    id: "DEFAULT",
    titel: `'Welches Medikament bei Verdacht auf meningitis?'`,
    antworten: `'${JSON.stringify([
      {
        id: 1,
        text: "antwort 1 it jetzt eine sehr sehr lange antwort ",
        correct: true,
      },
      { id: 2, text: "antwort 2", correct: false },
      { id: 3, text: "antwort 3", correct: false },
      { id: 4, text: "antwort 4", correct: false },
    ])}'`,
  },
  {
    id: "DEFAULT",
    titel: `'Bitte klassifiziren sie die folgende Fraktur gemäß AO-Klassifikation'`,
  },
  { id: "DEFAULT", titel: `'frage 3'` },
  {
    id: "DEFAULT",
    titel: `'Bitte klassifiziren sie die folgende Fraktur gemäß AO-Klassifikation'`,
  },
  { id: "DEFAULT", titel: `'frage 5'` },
  { id: "DEFAULT", titel: `'frage 6'` },
  { id: "DEFAULT", titel: `'frage 7'` },
  { id: "DEFAULT", titel: `'frage 8'` },
  { id: "DEFAULT", titel: `'frage 9'` },
  { id: "DEFAULT", titel: `'frage 10'` },
];
const benutzerFragen = [
  { benutzerId: "1", fragenId: "1" },
  { benutzerId: "2", fragenId: "1" },
  { benutzerId: "2", fragenId: "2" },
  { benutzerId: "1", fragenId: "4" },
  { benutzerId: "1", fragenId: "5" },
  { benutzerId: "1", fragenId: "6" },
  { benutzerId: "1", fragenId: "7" },
  { benutzerId: "1", fragenId: "8" },
  { benutzerId: "1", fragenId: "9" },
];

const tags = [
  { tagId: "DEFAULT", tagName: `'medizin'` },
  { tagId: "DEFAULT", tagName: `'pharmakologie'` },
  { tagId: "DEFAULT", tagName: `'alle fragen'` },
  { tagId: "DEFAULT", tagName: `'einfach'` },
  { tagId: "DEFAULT", tagName: `'coole sachen'` },
];
const fragenTags = [
  { fragenId: "1", tagId: 1 },
  { fragenId: "1", tagId: 2 },
  { fragenId: "1", tagId: 3 },
  { fragenId: "1", tagId: 4 },
  { fragenId: "1", tagId: 5 },
];

const quiz = [
  {
    quizId: "DEFAULT",
    completed: "false",
    titel: `'pharma'`,
    score: `'-'`,
    progress: `'0%'`,
  },
  {
    quizId: "DEFAULT",
    completed: "false",
    titel: `'2. random quiz'`,
    score: `'-'`,
    progress: `'0%'`,
  },
];

const benutzerQuiz = [
  {
    benutzerId: "1",
    quizId: "1",
  },
  {
    benutzerId: "1",
    quizId: "2",
  },
];

const QuizFragen = [
  {
    quizId: "1",
    fragenId: "1",
    pos: "1",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
  {
    quizId: "1",
    fragenId: "2",
    pos: "2",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
  {
    quizId: "1",
    fragenId: "3",
    pos: "3",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
  {
    quizId: "1",
    fragenId: "4",
    pos: "4",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
  {
    quizId: "1",
    fragenId: "5",
    pos: "5",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
  {
    quizId: "1",
    fragenId: "6",
    pos: "6",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
  {
    quizId: "1",
    fragenId: "7",
    pos: "7",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
  {
    quizId: "1",
    fragenId: "8",
    pos: "8",
    beantwortet: false,
    ausgewaehlteAntworten: "'{}'",
  },
];
module.exports = {
  benutzer: benutzer,
  fragen: fragen,
  benutzerfragen: benutzerFragen,
  tags: tags,
  fragenTags: fragenTags,
  quiz,
  benutzerQuiz,
  QuizFragen,
};
