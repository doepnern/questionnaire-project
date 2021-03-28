import React, { useState, useRef } from "react";
import { TextField, Button } from "@material-ui/core";
import { ReactComponent as ThrashButton } from "svg/trash_button.svg";
import ListDrag from "../../Misc/ListDrag/ListDrag";

export default function EditQuizComponents({
  questions,
  handleEditClick,
  children,
}) {
  console.log(questions);
  return (
    <div className="EditQuizContainer">
      <div className="qc_textField">
        <TextField
          fragenid="qc_titleInput"
          label="Title"
          variant="filled"
        ></TextField>
      </div>
      <EditQuizComponents.QuestionList
        questions={questions}
      ></EditQuizComponents.QuestionList>
      <EditQuizComponents.EditButton
        handleEditClick={handleEditClick}
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
  handleEditClick,
}) {
  return (
    <div className="qc_editQuestionDiv">
      <Button
        id="qc_editQuestion"
        variant="outlined"
        color="primary"
        onClick={handleEditClick}
      >
        ADD
      </Button>
    </div>
  );
};

EditQuizComponents.QuestionList = function EditQuizComponentsQuestionList({
  questions = [],
}) {
  const [questionState, setQuestions] = useState(questions);

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
                  <ThrashButton></ThrashButton>
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
