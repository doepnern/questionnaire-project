import React from "react";
import { Modal } from "components";
import "./QuestionSelection.scss";
import QuestionOverview from "pages/QuestionOverview";
import { QuestionContextProvider } from "context/QuestionContext";
export default function QuestionSelection({
  questionSelection,
  toggleShown,
  handleQuizAdding,
  questionsInQuiz,
}) {
  return (
    <Modal isShown={questionSelection.isShown} toggleShown={toggleShown}>
      <div
        className="QuestionSelectionContainer"
        onClick={(e) => e.stopPropagation()}
      >
        <QuestionContextProvider>
          <QuestionOverview
            mode="quizAdding"
            handleQuizAdding={handleQuizAdding}
            ignoreQuestions={questionsInQuiz}
          />
        </QuestionContextProvider>
      </div>
    </Modal>
  );
}
