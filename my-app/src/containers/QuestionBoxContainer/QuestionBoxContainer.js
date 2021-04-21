import React, { useState, useRef } from "react";
import { QuestionBox, PaginationSelection } from "components";
import { QuestionDetailedContainer } from "containers";
import "./QuestionBoxContainer.css";
import { useQuestionContext, clearHistory } from "context/QuestionContext";
import {
  updateQuestions,
  createQuestionForUser,
  deleteQuestionByid,
  deleteTagById,
  addTagForQuestion,
} from "services/UserService";

export default function QuestionBoxContainer({
  reloadQuestions,
  handleHeaderClick = undefined,
  setNewPage,
  getPaginationDisplayList,
  setNewLimit,
}) {
  const [showDetails, setShown] = useState({
    active: false,
    currentQuestion: 0,
  });
  const { questionContext, dispatch } = useQuestionContext();
  const questionBoxes = useRef(new Array(50));

  return (
    <div className="QuestionBoxWrapper">
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
            <QuestionBox
              key={question.fragenid}
              innerRef={(e) => (questionBoxes.current[question.fragenid] = e)}
              disabled={question.added}
            >
              <QuestionBox.Header
                onClick={() => handleQuestionBoxHeaderClick(index, question)}
              >
                <QuestionBox.Title>{question.fragenid}</QuestionBox.Title>
                <QuestionBox.Text>{question.titel}</QuestionBox.Text>
              </QuestionBox.Header>
              <QuestionBox.Body>
                <QuestionBox.Tags
                  handleAddingTag={(tagname) =>
                    handleAddingTag(tagname, question.fragenid)
                  }
                  handleRemoveTagClicked={(tagid) =>
                    handleRemoveTagClicked(tagid, question.fragenid)
                  }
                  tags={question.tags}
                ></QuestionBox.Tags>
                <QuestionBox.DeleteContainer
                  handleClick={(e) => {
                    e.stopPropagation();
                    questionBoxes.current[question.fragenid].style.animation =
                      "fadeOut 0.15s ease-out forwards, shrink 1s ease-out forwards";
                    questionBoxes.current[
                      question.fragenid
                    ].onanimationend = () =>
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
      <div className="paginationContainer">
        <PaginationSelection
          pages={
            getPaginationDisplayList
              ? getPaginationDisplayList().pagesListPretty
              : []
          }
          currentPage={
            getPaginationDisplayList
              ? getPaginationDisplayList().currentPage
              : -100
          }
          handlePageClick={setNewPage}
          handleLimitChange={(e) => setNewLimit(e.target.value)}
          limitList={getPaginationDisplayList()?.limitList}
        ></PaginationSelection>
      </div>
    </div>
  );

  function handleQuestionBoxHeaderClick(questionIndex, question) {
    if (handleHeaderClick) return handleHeaderClick(question);
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
    //update questions in db
    updateQuestions(
      questionContext.questions,
      () => console.log("successfully updated db"),
      () => console.log("db update failed")
    );
  }
  function handleRemoveTagClicked(tagid, questionid) {
    deleteTagById(tagid, questionid, () => {
      reloadQuestions();
    });
  }
  function handleAddingTag(tagName, questionid) {
    //see if tagName is a string of leth > 1
    if (typeof tagName === "string" && tagName.length > 0) {
      addTagForQuestion(tagName, questionid, () => reloadQuestions());
    }
  }
}
