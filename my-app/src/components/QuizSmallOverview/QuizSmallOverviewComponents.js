import React from "react";

export default function QuizSmallOverviewComponents({ ...restProps }) {
  return <div className="qso_container" {...restProps}></div>;
}

QuizSmallOverviewComponents.Question = function QuizSmallOverviewComponentsQuestion({
  handleClick,
  index,
  completed = false,
  ...restProps
}) {
  return (
    <div
      className={
        "qso_singleQuestionContainer" + (completed ? " completed" : "")
      }
      onClick={handleClick}
      {...restProps}
    >
      <div className="qso_questionNumber">
        <span className="spanLight">{index + 1}</span>
      </div>
    </div>
  );
};
