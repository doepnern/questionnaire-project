import React from "react";
import "./QuizItem.scss";
import { ReactComponent as PlusButton } from "svg/plus_button.svg";

export default function QuizItem({
  titel,
  completed,
  handleEditClick,
  handleDeleteClick,
  handleContinueClick,
  fragen = [],
}) {
  return (
    <div className="QuizItemContainer">
      <div className="QuizTitle">
        <span>{titel}</span>
      </div>
      <div className="QuizInfo">
        <span>Status: {completed ? "finished" : "In progress.."}</span>
        <span>Result: -</span>
      </div>
      <div className="secondQuizInfo">
        <span>Question: {fragen.length}</span>
        <span>Answered: 0</span>
      </div>
      <div className="buttonArea">
        <div
          className="QuizButtonContainer default_qbc "
          onClick={handleEditClick}
        >
          <div className="EnterQuiz">Edit Quiz</div>
        </div>
        <div className="QuizButtonContainer default_qbc">
          <div className="EnterQuiz" onClick={handleContinueClick}>
            Continue
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
