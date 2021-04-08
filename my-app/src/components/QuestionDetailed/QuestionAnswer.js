import { Checkbox } from "components";
import React, { useEffect, useRef, useState } from "react";
import { ReactComponent as PlusButton } from "svg/plus_button.svg";
import "./questionAnswer.scss";

export default function QuestionAnswer({ children, innerRef, ...restProps }) {
  return (
    <div className="qa_container" ref={innerRef}>
      {children}
    </div>
  );
}

//S
QuestionAnswer.SingleAnswer = function QuestionAnswerSingleAnswer({
  children,
  activated = false,
  handleAnswerClick,
  ...restProps
}) {
  return (
    <QuestionAnswer.SingleAnswerContainer
      handleClick={handleAnswerClick}
      {...restProps}
    >
      <div
        className={`answerCorrectness ${
          activated
            ? "answerCorrectness-correct"
            : "answerCorrectness-incorrect"
        }`}
      ></div>
      {children}
    </QuestionAnswer.SingleAnswerContainer>
  );
};

QuestionAnswer.AnswerTextContainer = function AnswerTextContainer({
  children,
  ...restProps
}) {
  return (
    <div className="answerTextContainer" {...restProps}>
      {children}
    </div>
  );
};

QuestionAnswer.EditAnswerTextContainer = function AnswerTextContainer({
  answerText,
  updateAnswer,
  ...restProps
}) {
  const initialAnswer = useRef(undefined);
  const [inputText, setInput] = useState(answerText);
  const inputRef = useRef(undefined);
  //update the input field when the prop text changes
  useEffect(() => {
    initialAnswer.current = answerText;
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (initialAnswer.current !== answerText) {
      setInput(answerText);
    }
  }, [answerText]);
  return (
    <div className="answerTextContainer" {...restProps}>
      <input
        className="editAnswerinput"
        type="text"
        ref={inputRef}
        value={inputText}
        onChange={(e) => {
          setInput(e.target.value);
        }}
        onBlur={updateAnswer}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

QuestionAnswer.SingleAnswerContainer = function SingleAnswerContainer({
  handleClick,
  children,
  ...restprops
}) {
  return (
    <>
      <div
        className="qa_singleAnswerContainer"
        onClick={handleClick}
        {...restprops}
      >
        {children}
      </div>
    </>
  );
};

QuestionAnswer.SingleAnswerContainerOld = function SingleAnswerContainerOld({
  handleClick,
  children,
  ...restprops
}) {
  return (
    <>
      <div
        className="qa_singleAnswerContainer"
        onClick={handleClick}
        {...restprops}
      >
        {children}
      </div>
    </>
  );
};

QuestionAnswer.Button = function ({ children, handleClick, ...restProps }) {
  return (
    <div className="answerButtonDiv" onClick={handleClick}>
      {children}
    </div>
  );
};

QuestionAnswer.AddAnswerContainer = function QuestionAnswerAddAnswer({
  children,
  handleClick,
  ...restProps
}) {
  return (
    <QuestionAnswer.SingleAnswerContainer
      style={{ backgroundColor: "rgba(0,0,0,0)" }}
    >
      <div className="addAnswerContainer" onClick={handleClick}>
        <PlusButton />
      </div>
    </QuestionAnswer.SingleAnswerContainer>
  );
};
