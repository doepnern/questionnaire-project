import React from "react";
import EditQuizComponents from "./EditQuizComponents";
import "./EditQuiz.scss";
import QuestionDetailed from "../../QuestionDetailed/QuestionDetailed";

export default function EditQuiz({
  editingQuiz,
  toggleShown,
  handleAddClick,
  handleTrashClick,
  quizzes,
  updateCurrentlyEditingQuiz,
}) {
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
        handleSubmitClick={handleSubmitQuiz}
      ></EditQuizComponents>
    </QuestionDetailed.Container>
  );
  function findQuiz() {
    return quizzes.filter((q) => q.quizid === editingQuiz.quizEditing);
  }

  function handleSubmitQuiz(newQuiz) {
    //for user 1
    updateCurrentlyEditingQuiz(newQuiz, 1);
    toggleShown();
  }
}

function preventUndefined(x) {
  if (x == null || x.length < 1 || x[0].fragen == null) return [];
  return x[0];
}
//makes sure every question has a position, which is needed for the draggable list, gives preference to innate position, if no position is present, takes index as position
function formatFragenWithPos(x) {
  let x1 = preventUndefined(x);
  if (x1.length < 1) return;
  return x[0].fragen.map((q, index) => {
    return { pos: index, ...q };
  });
}
