const benutzer = [
  { id: "DEFAULT", benutzername: `'master'` },
  { id: "DEFAULT", benutzername: `'second User'` },
  { id: "DEFAULT", benutzername: `'third User'` },
  { id: "DEFAULT", benutzername: `'second User'` },
];
const fragen = [
  {
    id: "DEFAULT",
    titel: `'Welches ist kein Antibiotikum?'`,
    antworten: `'${JSON.stringify([
      {
        id: 1,
        text: "Ciprofloxacin",
        correct: false,
      },
      { id: 2, text: "Metoprolol", correct: true },
      { id: 3, text: "Clindamycin", correct: false },
      { id: 4, text: "Ampicillin", correct: false },
    ])}'`,
  },
  {
    id: "DEFAULT",
    titel: `'Welches Medikament zur prophylaxe einer Meningitis'`,
    antworten: `'${JSON.stringify([
      {
        id: 1,
        text: "Rifampicin",
        correct: true,
      },
      { id: 2, text: "Ciprofloxacin", correct: false },
      { id: 3, text: "Doxyciclin", correct: false },
      { id: 4, text: "Penicillin G", correct: false },
    ])}'`,
  },
  {
    id: "DEFAULT",
    titel: `'Wer ist der beste boulderer?'`,
    antworten: `'${JSON.stringify([
      {
        id: 1,
        text: "Manuel",
        correct: true,
      },
      { id: 2, text: "Niclas", correct: true },
      { id: 3, text: "Fini", correct: true },
      { id: 4, text: "Jan Felix", correct: false },
    ])}'`,
  },
];
const benutzerFragen = [
  { benutzerId: "1", fragenId: "1" },
  { benutzerId: "1", fragenId: "2" },
  { benutzerId: "1", fragenId: "3" },
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
    titel: `'Wichtige fragen'`,
    score: `'-'`,
    progress: `'0%'`,
  },
];

const benutzerQuiz = [
  {
    benutzerId: "1",
    quizId: "1",
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
