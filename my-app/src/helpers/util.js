export function formatAnswersFromQuestion(questions) {
  return questions.map((q) => ({
    ...q,
    antworten: q.antworten ? JSON.parse(q.antworten) : [],
  }));
}

export function formatQuizResult(quiz) {
  return { ...quiz, fragen: formatAnswersFromQuestion(quiz.fragen) };
}
