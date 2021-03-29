import React, { useState, useEffect, useRef } from "react";
import { TextField, Button } from "@material-ui/core";
import { ReactComponent as TrashButton } from "svg/trash_button.svg";
import ListDrag from "../../Misc/ListDrag/ListDrag";
import _ from "lodash";

export default function EditQuizComponents({
  currentQuiz,
  handleAddClick,
  handleTrashClick,
  children,
}) {
  const questions = currentQuiz.questions;
  const titel = currentQuiz.titel;
  useEffect(() => {
    console.log("rerendered quizComponents page");
    console.log(questions);
  });
  return (
    <div className="EditQuizContainer">
      <div className="qc_textField">
        <TextField
          fragenid="qc_titleInput"
          label="Title"
          variant="filled"
          value={titel}
        ></TextField>
      </div>
      <EditQuizComponents.QuestionList
        questions={questions}
        handleTrashClick={handleTrashClick}
      ></EditQuizComponents.QuestionList>
      <EditQuizComponents.EditButton
        handleAddClick={handleAddClick}
      ></EditQuizComponents.EditButton>
      <div className="qc_submitButton">
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </div>
  );
}

EditQuizComponents.EditButton = function EditQuizComponentsEditButton({
  handleAddClick,
}) {
  return (
    <div className="qc_editQuestionDiv">
      <Button
        id="qc_editQuestion"
        variant="outlined"
        color="primary"
        onClick={handleAddClick}
      >
        ADD
      </Button>
    </div>
  );
};

EditQuizComponents.QuestionList = function EditQuizComponentsQuestionList({
  questions = [],
  handleTrashClick,
}) {
  //reload state when questions change
  const [questionState, setQuestions] = useState(questions);
  const previousQuestions = useRef(questions);
  useEffect(() => {
    if (questions === previousQuestions.current) return;
    previousQuestions.current = questions;
    setQuestions(() => questions);
  }, [questions]);
  return (
    <ListDrag
      className="qc_QuestionList"
      state={questionState}
      setState={setQuestions}
      stateId={"fragenid"}
    >
      {questionState.length < 1
        ? getEmptyPlaceholder()
        : questionState
            .sort((a, b) => (a.pos <= b.pos ? -1 : 1))
            .map((q, index) => (
              <ListDrag.Item
                className="qc_singleQuestion"
                key={q.fragenid}
                dataPos={q.pos}
                dataId={q.fragenid}
                index={index}
              >
                <span>
                  {index + 1}: {q.titel}
                </span>
                <div className="qc_singleQuestionTrash">
                  <TrashButton
                    onClick={() => handleTrashClick(q)}
                  ></TrashButton>
                </div>
              </ListDrag.Item>
            ))}
    </ListDrag>
  );

  function getEmptyPlaceholder() {
    return (
      <div className="qc_emptyQuestionList">
        <span>No Questions added</span>
      </div>
    );
  }
};
