import React from "react";
import { TextField, Button } from "@material-ui/core";
import { ReactComponent as ThrashButton } from "svg/trash_button.svg";
export default function EditQuizComponents({ children }) {
  return (
    <div className="EditQuizContainer">
      <div className="qc_textField">
        <TextField
          id="qc_titleInput"
          label="Title"
          variant="filled"
        ></TextField>
      </div>
      <EditQuizComponents.QuestionList></EditQuizComponents.QuestionList>
      <EditQuizComponents.EditButton></EditQuizComponents.EditButton>
      <div className="qc_submitButton">
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </div>
  );
}

/*
 <div className="qc_info">
        <span>Questions: 20</span>
      </div>
      */

EditQuizComponents.EditButton = function EditQuizComponentsEditButton() {
  return (
    <div className="qc_editQuestionDiv">
      <Button id="qc_editQuestion" variant="outlined" color="primary">
        ADD
      </Button>
    </div>
  );
};

EditQuizComponents.QuestionList = function EditQuizComponentsQuestionList({
  questions = [
    { titel: "question 1 is an example question with quite some length" },
    {
      titel:
        "question 2 is an example question with qeven more length than question 1",
    },
  ],
}) {
  return (
    <div className="qc_QuestionList">
      {questions.length < 1
        ? getEmptyPlaceholder()
        : questions.map((q, index) => (
            <div className="qc_singleQuestion" key={index}>
              <span>
                {index + 1}: {q.titel}
              </span>
              <div className="qc_singleQuestionTrash">
                <ThrashButton></ThrashButton>
              </div>
            </div>
          ))}
    </div>
  );

  function getEmptyPlaceholder() {
    return (
      <div className="qc_emptyQuestionList">
        <span>No Questions added</span>
      </div>
    );
  }
};
