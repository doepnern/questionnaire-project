import { QuestionBox, QuestionAnswer } from "components";
import React, { useRef, useState } from "react";
import { QuestionDetailed } from "components";
import { ReactComponent as UndoButton } from "svg/back_button.svg";
import { ReactComponent as RedoButton } from "svg/redo_button.svg";
import {
  useQuestionContext,
  undo,
  redo,
  updateQuestion,
} from "context/QuestionContext.js";
import { ReactComponent as EditButtonMinimal } from "svg/edit_minimal.svg";
import "./questionDetailed.scss";
import {
  removeAnswer,
  updateQuestionStorage,
  addAnswer,
  updateAnswer,
} from "helpers/QuestionHelpers/QuestionStorage/QuestionStorage.js";
import { ListDrag } from "components";

export default function QuestionDetailedContainer({
  children,
  isShown = true,
  handleDetailViewClose,
  currentQuestionIndex,
  dispatchQuestionUpdate,
  ...restProps
}) {
  const { questionContext, dispatch } = useQuestionContext();
  return (
    <QuestionDetailed.Container
      isShown={isShown}
      toggleShown={handleDetailViewClose}
    >
      <QuestionDetailed.Layout
        question={questionContext.questions[currentQuestionIndex]}
        dispatch={dispatch}
        questionContext={questionContext}
      ></QuestionDetailed.Layout>
    </QuestionDetailed.Container>
  );
}

QuestionDetailed.Layout = function QuestionDetailedLayout({
  children,
  question,
  dispatch,
  questionContext,
  ...restProps
}) {
  const [editing, setEditing] = useState("inactive");
  const switchEditing = (x) => {
    switch (x) {
      case "inactive":
        return "active";
      case "active":
        return "inactive";
      default:
        return x;
    }
  };
  const draggingContainer = useRef(null);
  return (
    <div className="qd_container">
      <div className="qd_headerContainer">
        <QuestionBox.Title
          style={{ fontSize: "30px" }}
          classNameAdd={"-detailed"}
        >
          {question.fragenid}
          <div
            className="editMinimal"
            title={"edit title"}
            onClick={() => setEditing(switchEditing(editing))}
          >
            <EditButtonMinimal />
          </div>
        </QuestionBox.Title>
        {editing === "active" ? (
          <QuestionBox.TextEditing
            currentText={question.titel}
            handleBlur={(e) => {
              dispatch(
                updateQuestion(
                  question.fragenid,
                  updateQuestionStorage({
                    titel: e.target.value,
                  })
                )
              );
              setEditing("disabled");
              setTimeout(() => setEditing("inactive"), 400);
            }}
          ></QuestionBox.TextEditing>
        ) : (
          <QuestionBox.Text classNameAdd={"-detailed"}>
            {question.titel}
          </QuestionBox.Text>
        )}
      </div>
      <div className="qd_bodyContainer">
        {formatAnswers(question, questionContext)}
        <div className="undoRedoContainer">
          <UndoButton
            className={
              questionContext.QuestionStorage.canTravelBackward()
                ? "undoRedoActive"
                : "undoRedoInactive"
            }
            onClick={() => dispatch(undo())}
          ></UndoButton>
          <RedoButton
            className={
              questionContext.QuestionStorage.canTravelForward()
                ? "undoRedoActive"
                : "undoRedoInactive"
            }
            onClick={() => dispatch(redo())}
          ></RedoButton>
        </div>
      </div>
    </div>
  );
  //converts answers from stringified JSON array to JSX content
  function formatAnswers(q, questionContext) {
    return (
      <ListDrag nodeRef={draggingContainer}>
        <QuestionAnswer innerRef={draggingContainer}>
          {!(q.antworten == null) &&
            q.antworten.map((answer, index) => {
              if (!(answer == null)) {
                //check if answer was just added, so it can be in edit mode by default
                let justAdded =
                  questionContext.newAnswer && index === q.antworten.length - 1;
                return (
                  <QuestionDetailed.VariableSingleAnswer
                    wasJustAdded={justAdded}
                    key={index}
                    answer={answer}
                    handleClick={() => {
                      dispatch(updateQuestion(q.fragenid, removeAnswer(index)));
                    }}
                    handleUpdateAnswer={(e) =>
                      dispatch(
                        updateQuestion(q.fragenid, updateAnswer(index, e))
                      )
                    }
                  />
                );
              } else return <></>;
            })}
          <QuestionAnswer.AddAnswerContainer
            handleClick={(e) => {
              e.stopPropagation();
              dispatch(updateQuestion(q.fragenid, addAnswer()));
            }}
          />
        </QuestionAnswer>
      </ListDrag>
    );
  }
};
