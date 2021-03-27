import React, { useEffect } from "react";
import EditQuizComponents from "./EditQuizComponents";
import "./EditQuiz.scss";
import QuestionDetailed from "../../QuestionDetailed/QuestionDetailed";

export default function EditQuiz({
  editingQuiz,
  toggleShown,
  showQuestionSelection = () => undefined,
}) {
  useEffect(() => console.log(editingQuiz));
  return (
    <QuestionDetailed.Container
      isShown={editingQuiz.isEditing}
      toggleShown={toggleShown}
      style={{
        width: "40%",
        height: "50%",
        minWidth: "540px",
        minHeight: "420px",
      }}
    >
      <EditQuizComponents
        questions={exampleQuestions()}
        handleEditClick={() => showQuestionSelection()}
      ></EditQuizComponents>
    </QuestionDetailed.Container>
  );
}

function exampleQuestions() {
  return [
    {
      id: 7,
      titel: "question 1 is an example question with quite some length",
      pos: 2,
    },
    {
      id: 1588,
      titel:
        "question 2 is an example question with qeven more length than question 1",
      pos: 3,
    },
    {
      id: 199,
      titel: "question last is an example question with quite some length",
      pos: 1,
    },
    {
      id: 78,
      titel: "question 1 is an example question with quite some length",
      pos: 2,
    },
    {
      id: 158,
      titel:
        "question 2 is an example question with qeven more length than question 1",
      pos: 39,
    },
    {
      id: 1422,
      titel: "question last is an example question with quite some length",
      pos: 1,
    },
    {
      id: 74,
      titel: "question 1 is an example question with quite some length",
      pos: 2,
    },
    {
      id: 153,
      titel:
        "question 2 is an example question with qeven more length than question 1",
      pos: 3,
    },
    {
      id: 14,
      titel: "question last is an example question with quite some length",
      pos: 1,
    },
  ];
}
