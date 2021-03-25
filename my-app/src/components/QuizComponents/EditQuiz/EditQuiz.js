import React, { useEffect } from "react";
import EditQuizComponents from "./EditQuizComponents";
import "./EditQuiz.scss";
import QuestionDetailed from "../../QuestionDetailed/QuestionDetailed";

export default function EditQuiz({ editingQuiz, toggleShown }) {
  useEffect(() => console.log(editingQuiz));
  return (
    <QuestionDetailed.Container
      isShown={editingQuiz.isEditing}
      toggleShown={toggleShown}
      style={{
        width: "40%",
        height: "50%",
        minWidth: "380px",
        minHeight: "377px",
      }}
    >
      <EditQuizComponents></EditQuizComponents>
    </QuestionDetailed.Container>
  );
}
