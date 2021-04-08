import React, { useEffect } from "react";
import EditQuizComponents from "./EditQuizComponents";
import "./EditQuiz.scss";
import QuestionDetailed from "../../QuestionDetailed/QuestionDetailed";

export default function EditQuiz({
  editingQuiz,
  toggleShown,
  handleAddClick,
  handleTrashClick,
  quizzes,
}) {
  console.log(quizzes);
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
        currentQuiz={
          quizzes && quizzes.length > 0
            ? {
                questions: formatFragenWithPos(findQuiz()),
                titel: preventUndefined(findQuiz()).titel,
              }
            : { questions: [], titel: "" }
        }
        handleAddClick={handleAddClick}
        handleTrashClick={handleTrashClick}
      ></EditQuizComponents>
    </QuestionDetailed.Container>
  );
  function findQuiz() {
    return quizzes.filter((q) => q.quizid === editingQuiz.quizEditing);
  }
}

function preventUndefined(x) {
  if (x == null || x.length < 1 || x[0].fragen == null) return [];
  return x[0];
}
function formatFragenWithPos(x) {
  let x1 = preventUndefined(x);
  if (x1.length < 1) return;
  return x[0].fragen.map((q, index) => {
    return { pos: index, ...q };
  });
}
