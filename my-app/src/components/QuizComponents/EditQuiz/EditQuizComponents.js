import React, { useState, useEffect, useRef } from "react";
import { TextField, Button } from "@material-ui/core";
import { ReactComponent as TrashButton } from "svg/trash_button.svg";
import ListDrag from "../../Misc/ListDrag/ListDrag";
import _ from "lodash";

export default function EditQuizComponents({
  currentQuiz,
  handleAddClick,
  handleTrashClick,
  handleSubmitClick,
  children,
}) {
  const questions = currentQuiz.questions ? currentQuiz.questions : [];
  const titel = currentQuiz.titel ? currentQuiz.titel : "undefined";
  //reload state when questions change
  const [questionState, setQuestions] = useState(questions);
  const previousQuestions = useRef(questions);
  const [titelState, setTitel] = useState(titel);

  //if questions are changed putside this component, update question
  useEffect(() => {
    if (questions === previousQuestions.current) return;
    previousQuestions.current = questions;
    setQuestions(() => questions);
  }, [currentQuiz]);

  //if title is changed outside this component, update title
  useEffect(() => {
    if (currentQuiz.titel && !(titelState === currentQuiz.titel)) {
      setTitel(currentQuiz.titel);
    }
  }, [currentQuiz.titel]);

  return (
    <div className="EditQuizContainer">
      <div className="qc_textField">
        <TextField
          fragenid="qc_titleInput"
          label="Title"
          variant="filled"
          value={titelState}
          onChange={(e) => setTitel(e.target.value)}
        ></TextField>
      </div>
      <EditQuizComponents.QuestionList
        questionState={questionState}
        setQuestions={setQuestions}
        handleTrashClick={handleTrashClick}
      ></EditQuizComponents.QuestionList>
      <EditQuizComponents.EditButton
        handleAddClick={handleAddClick}
      ></EditQuizComponents.EditButton>
      <div className="qc_submitButton">
        <Button
          variant="contained"
          color="primary"
          onClick={() =>
            handleSubmitClick({ fragen: questionState, titel: titelState })
          }
        >
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
  questionState,
  setQuestions,
  handleTrashClick,
}) {
  return (
    <ListDrag
      state={questionState}
      setState={setQuestions}
      stateId={"fragenid"}
      className="qc_QuestionList"
    >
      {!questionState || questionState.length < 1
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
