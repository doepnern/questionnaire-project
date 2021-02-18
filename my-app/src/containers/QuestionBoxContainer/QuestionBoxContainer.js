import React, { useState } from "react";
import { QuestionBox } from "components";
import { QuestionDetailedContainer } from "containers";
import "./QuestionBoxContainer.css";
import {
  updateQuestion,
  useQuestionContext,
  clearHistory,
} from "context/QuestionContext";
import { updateQuestions } from "services/UserService";
import _ from "lodash";

export default function QuestionBoxContainer({ questions }) {
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
        questions={{
          questionArray: questionContext.questions,
          currentClicked: showDetails.currentQuestion,
        }}
        functionality={{
          removeAnswer: removeAnswer,
          addAnswer: addAnswer,
          updateAnswer: updateAnswer,
          dispatchUpdate: (q) => dispatch(updateQuestion(q)),
        }}
      ></QuestionDetailedContainer>
      {questionContext.questions.map((question, index) => {
        return (
          <QuestionBox key={index}>
            <QuestionBox.Header
              onClick={() => handleQuestionBoxHeaderClick(index)}
            >
              <QuestionBox.Title>{index + 1}</QuestionBox.Title>
              <QuestionBox.Text>{question.titel}</QuestionBox.Text>
            </QuestionBox.Header>
            <QuestionBox.Body>
              <QuestionBox.Tags tags={question.tags}></QuestionBox.Tags>
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

  function removeAnswer(question, answerIndex, dispatchUpdate) {
    let newArr = question.antworten;
    newArr.splice(answerIndex, 1, null);
    let cpy = _.cloneDeep(question);
    cpy.antworten = newArr;
    dispatchUpdate(cpy);
  }

  function addAnswer(question, newAnswer, dispatchUpdate) {
    let newArr = question.antworten;
    if (newArr == null) {
      newArr = [];
    }
    let myNewAnswer = { text: "default", correct: false };
    Object.keys(newAnswer).forEach(
      (key) => (myNewAnswer[key] = newAnswer[key])
    );
    newArr.push([myNewAnswer, "added"]);
    let cpy = _.cloneDeep(question);
    cpy.antworten = newArr;
    dispatchUpdate(cpy);
  }

  function updateAnswer(question, index, newAnswer, dispatchUpdate) {
    let newArr = _.cloneDeep(question.antworten);
    if (newArr == null) {
      newArr = [];
    }
    if (newAnswer !== null) {
      if (typeof newArr[index] !== undefined) {
        Object.keys(newArr[index]).forEach((key) => {
          if (newAnswer[key] != null) newArr[index][key] = newAnswer[key];
        });
      }
    }
    let cpy = _.cloneDeep(question);
    cpy.antworten = newArr;
    dispatchUpdate(cpy);
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