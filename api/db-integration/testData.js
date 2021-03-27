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
        text: "antwort 1 it jetzt eine sehr sehr lange antwort ",
        correct: true,
      },
      { text: "antwort 2", correct: false },
      { text: "antwort 3", correct: false },
      { text: "antwort 4", correct: false },
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
];
const benutzerFragen = [
  { benutzerId: "1", fragenId: "1" },
  { benutzerId: "2", fragenId: "1" },
  { benutzerId: "2", fragenId: "2" },
  { benutzerId: "1", fragenId: "4" },
  { benutzerId: "1", fragenId: "5" },
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
  { quizId: "DEFAULT", completed: "false", titel: `'pharma'` },
  { quizId: "DEFAULT", completed: "false", titel: `'2. random quiz'` },
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
  },
  { quizId: "1", fragenId: "3" },
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
