import React from "react";
import { TextField, Button } from "@material-ui/core";
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
  questions = [],
}) {
  return (
    <div className="qc_QuestionList">
      {getEmptyPlaceholder()}
      <div className="qc_singleQuestion">
        <span>
          Frage nr 1 ist gar keine so lange frage, sollte aber trotzdem
          reinpassen fgalls noch längere kommen
        </span>
      </div>
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
