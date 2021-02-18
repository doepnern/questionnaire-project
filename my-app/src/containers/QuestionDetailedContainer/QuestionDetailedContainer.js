import { QuestionBox, QuestionAnswer } from "components";
import React from "react";
import { QuestionDetailed } from "components";
import { ReactComponent as UndoButton } from "svg/back_button.svg";
import { ReactComponent as RedoButton } from "svg/redo_button.svg";
import { useQuestionContext, undo, redo } from "context/QuestionContext.js";

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
          num: questions.currentClicked + 1,
          ...questions.questionArray[questions.currentClicked],
        }}
        functionality={functionality}
        dispatch={dispatch}
        questionContext={questionContext}
      ></QuestionDetailed.Layout>
    </QuestionDetailed.Container>
  );
}

QuestionDetailed.Layout = function ({
  children,
  question,
  functionality,
  dispatch,
  questionContext,
  ...restProps
}) {
  console.log(question);
  return (
    <div className="qd_container">
      <div className="qd_headerContainer">
        <QuestionBox.Title
          style={{ fontSize: "30px" }}
          classNameAdd={"-detailed"}
        >
          {question.num}
        </QuestionBox.Title>
        <QuestionBox.Text classNameAdd={"-detailed"}>
          {question.titel}
        </QuestionBox.Text>
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
              let justAdded = false;
              if (answer instanceof Array) {
                answer = answer[0];
                justAdded = true;
                q.antworten[index] = answer;
              }
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
