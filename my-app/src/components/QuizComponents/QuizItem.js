import React from "react";
import "./QuizItem.scss";
import { ReactComponent as PlusButton } from "svg/plus_button.svg";

export default function QuizItem({
  titel,
  completed,
  handleEditClick,
  handleDeleteClick,
  handleContinueClick,
  handleRestartClick,
  score = "-",
  progress = "-",
  fragen = [],
}) {
  return (
    <div className="QuizItemContainer">
      <div className="QuizTitle">
        <span>{titel}</span>
      </div>
      <div className="QuizInfo">
        <span>Status: {completed ? "finished" : "In progress.."}</span>
        <span>Result: {score}</span>
      </div>
      <div className="secondQuizInfo">
        <span>Question: {fragen.length}</span>
        <span>Progress: {progress}</span>
      </div>
      <div className="buttonArea">
        <div
          className="QuizButtonContainer default_qbc "
          onClick={handleEditClick}
        >
          <div className="EnterQuiz">Edit Quiz</div>
        </div>
        <div className="QuizButtonContainer default_qbc">
          <div
            className="EnterQuiz"
            onClick={completed ? handleRestartClick : handleContinueClick}
          >
            {completed ? "Restart" : "Continue"}
          </div>
        </div>
        <div className="QuizButtonContainer delete_qbc">
          <div className="EnterQuiz" onClick={handleDeleteClick}>
            Delete
          </div>
        </div>
      </div>
    </div>
  );
}

QuizItem.NewQuizItem = function QuizItemNewQuizItem({ handleClick }) {
  return (
    <div className="QuizItemContainer" onClick={handleClick}>
      <div className="NewQuizButtonContainer">
        <span>Add Quiz</span>
        <PlusButton></PlusButton>
      </div>
    </div>
  );
};

QuizItem.QuizContainer = function QuizItemQuizContainer({ children }) {
  return <div className="QuizItemBaseContainer">{children}</div>;
};
