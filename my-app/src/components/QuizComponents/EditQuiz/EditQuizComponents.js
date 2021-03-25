import React from "react";
import { TextField, Button } from "@material-ui/core";
export default function EditQuizContainer({ children }) {
  return (
    <div className="EditQuizContainer">
      <div className="qc_textField">
        <TextField
          id="qc_titleInput"
          label="Title"
          variant="filled"
        ></TextField>
      </div>
      <div className="qc_info">
        <span>Questions: 20</span>
      </div>
      <div className="qc_editQuestionDiv">
        <Button id="qc_editQuestion" variant="outlined" color="primary">
          Edit Question
        </Button>
      </div>

      <div className="qc_submitButton">
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </div>
  );
}
