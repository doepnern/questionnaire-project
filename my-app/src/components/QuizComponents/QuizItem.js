import React from "react";
import "./QuizItem.scss";
import { ReactComponent as PlusButton } from "svg/plus_button.svg";

export default function QuizItem({ handleClick }) {
  return (
    <div className="QuizItemContainer" onClick={handleClick}>
      <div className="QuizTitle">
        <span>pharmakologie 1sadasdasdas</span>
      </div>
      <div className="QuizInfo">
        <span>Status: In progress</span>
        <span>Result: -</span>
      </div>
      <div className="secondQuizInfo">
        <span>Question: 20</span>
        <span>Answered: 18</span>
      </div>
      <div className="buttonArea">
        <div className="EnterQuizButtonContainer">
          <div className="EnterQuiz">Edit Quiz</div>
        </div>
        <div className="EnterQuizButtonContainer">
          <div className="EnterQuiz">Continue</div>
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