import { QuestionBox, QuestionAnswer } from "components";
import React, { useEffect, useRef, useState } from "react";
import { QuestionDetailed } from "components";
import { ReactComponent as UndoButton } from "svg/back_button.svg";
import { ReactComponent as RedoButton } from "svg/redo_button.svg";
import {
  useQuestionContext,
  undo,
  redo,
  updateQuestion,
  seenNew,
} from "context/QuestionContext.js";
import { ReactComponent as EditButtonMinimal } from "svg/edit_minimal.svg";
import "./questionDetailed.scss";

export default function QuestionDetailedContainer({
  children,
  isShown = true,
  handleDetailViewClose,
  questions,
  functionality,
  ...restProps
}) {
  const { questionContext, dispatch } = useQuestionContext();
  return (
    <QuestionDetailed.Container
      isShown={isShown}
      toggleShown={handleDetailViewClose}
    >
      <QuestionDetailed.Layout
        question={{
          ...questions.questionArray[questions.currentClicked],
        }}
        functionality={functionality}
        dispatch={dispatch}
        questionContext={questionContext}
      ></QuestionDetailed.Layout>
    </QuestionDetailed.Container>
  );
}

QuestionDetailed.Layout = function QuestionDetailedLayout({
  children,
  question,
  functionality,
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
                updateQuestion({
                  fragenid: question.fragenid,
                  titel: e.target.value,
                })
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
        {formatAnswers(question, functionality)}
        <div className="undoRedoContainer">
          <UndoButton
            className={
              questionContext.history.canTravelBackward()
                ? "undoRedoActive"
                : "undoRedoInactive"
            }
            onClick={() => dispatch(undo())}
          ></UndoButton>
          <RedoButton
            className={
              questionContext.history.canTravelForward()
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
  function formatAnswers(q, functionality) {
    return (
      <QuestionAnswer>
        {!(q.antworten == null) &&
          q.antworten.map((answer, index) => {
            if (!(answer == null)) {
              //check if answer was just added, so it can be in edit mode by default
              let justAdded = answer.new ? answer.new : false;
              return (
                <QuestionDetailed.VariableSingleAnswer
                  wasJustAdded={justAdded}
                  key={index}
                  answer={answer}
                  handleClick={(e) => {
                    e.stopPropagation();
                    functionality.removeAnswer(
                      q,
                      index,
                      functionality.dispatchUpdate
                    );
                  }}
                  handleUpdateAnswer={(e) =>
                    functionality.updateAnswer(
                      q,
                      index,
                      e,
                      functionality.dispatchUpdate
                    )
                  }
                />
              );
            }
          })}
        <QuestionAnswer.AddAnswerContainer
          handleClick={(e) => {
            e.stopPropagation();
            console.log(q);
            functionality.addAnswer(
              q,
              { text: "my new answer" },
              functionality.dispatchUpdate
            );
          }}
        />
      </QuestionAnswer>
    );
  }
};
