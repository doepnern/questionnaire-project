import React, { useState } from "react";
import { QuestionBox } from "components";
import { QuestionDetailedContainer } from "containers";
import "./QuestionBoxContainer.css";
import {
  updateQuestion,
  useQuestionContext,
  clearHistory,
} from "context/QuestionContext";
import {
  updateQuestions,
  createQuestionForUser,
  deleteQuestionByid,
} from "services/UserService";
import _ from "lodash";

export default function QuestionBoxContainer({ reloadQuestions }) {
  const [showDetails, setShown] = useState({
    active: false,
    currentQuestion: 0,
  });
  const { questionContext, dispatch } = useQuestionContext();

  return (
    <div className="QuestionBoxContainer">
      <QuestionDetailedContainer
        isShown={showDetails.active}
        toggleShown={() =>
          setShown((s) => {
            return { ...s, active: !s.active };
          })
        }
        handleDetailViewClose={() => handleDetailViewClose()}
        currentQuestionIndex={showDetails.currentQuestion}
      ></QuestionDetailedContainer>
      <QuestionBox
        onClick={() => createQuestionForUser(1).then(() => reloadQuestions())}
      >
        <QuestionBox.NewQuestion />
      </QuestionBox>
      {questionContext.questions.map((question, index) => {
        return (
          <QuestionBox key={index}>
            <QuestionBox.Header
              onClick={() => handleQuestionBoxHeaderClick(index)}
            >
              <QuestionBox.Title>{question.fragenid}</QuestionBox.Title>
              <QuestionBox.Text>{question.titel}</QuestionBox.Text>
            </QuestionBox.Header>
            <QuestionBox.Body>
              <QuestionBox.Tags tags={question.tags}></QuestionBox.Tags>
              <QuestionBox.DeleteContainer
                handleClick={(e) => {
                  e.stopPropagation();
                  deleteQuestionByid(question.fragenid).then(() =>
                    reloadQuestions()
                  );
                }}
              />
            </QuestionBox.Body>
          </QuestionBox>
        );
      })}
    </div>
  );

  function handleQuestionBoxHeaderClick(questionIndex) {
    // fill Question Details with informations, then
    setShown((s) => {
      return { active: !s.active, currentQuestion: questionIndex };
    });
  }

  function handleDetailViewClose() {
    //stop history keeping
    dispatch(clearHistory());
    //toggleShown
    setShown((s) => {
      return { ...s, active: !s.active };
    });
    //TODO: dispatch update to db, when getting response rerender main screen, in case of erreor reload last closed question
    updateQuestions(
      questionContext.questions,
      () => console.log("successfully updated db"),
      () => console.log("db update failed")
    );
  }
}
