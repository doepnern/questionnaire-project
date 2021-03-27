import React, { useState, useRef } from "react";
import { TextField, Button } from "@material-ui/core";
import { ReactComponent as ThrashButton } from "svg/trash_button.svg";

export default function EditQuizComponents({
  questions,
  handleEditClick,
  children,
}) {
  console.log(questions);
  return (
    <div className="EditQuizContainer">
      <div className="qc_textField">
        <TextField
          fragenid="qc_titleInput"
          label="Title"
          variant="filled"
        ></TextField>
      </div>
      <EditQuizComponents.QuestionList
        questions={questions}
      ></EditQuizComponents.QuestionList>
      <EditQuizComponents.EditButton
        handleEditClick={handleEditClick}
      ></EditQuizComponents.EditButton>
      <div className="qc_submitButton">
        <Button variant="contained" color="primary">
          Submit
        </Button>
      </div>
    </div>
  );
}

EditQuizComponents.EditButton = function EditQuizComponentsEditButton({
  handleEditClick,
}) {
  return (
    <div className="qc_editQuestionDiv">
      <Button
        id="qc_editQuestion"
        variant="outlined"
        color="primary"
        onClick={handleEditClick}
      >
        ADD
      </Button>
    </div>
  );
};

EditQuizComponents.QuestionList = function EditQuizComponentsQuestionList({
  questions = [],
}) {
  const [questionState, setQuestions] = useState(questions);
  const placeHolder = (index) => (
    <div className="qc_singleQuestion" key={index}></div>
  );
  const draggables = useRef([]);
  const container = useRef(null);
  const currentlyDraggingRef = useRef(null);
  //for performance reasons save last after element, so recalculating of positions only needs to be done if afterElement changes
  const lastAfterElement = useRef(null);

  return (
    <div
      className="qc_QuestionList"
      ref={container}
      onDragOver={handleDragOver}
    >
      {questionState.length < 1
        ? getEmptyPlaceholder()
        : questionState
            .sort((a, b) => (a.pos <= b.pos ? -1 : 1))
            .map((q, index) => (
              <div
                className="qc_singleQuestion draggable"
                key={q.fragenid}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onTouchStart={handleDragStart}
                onTouchEnd={handleDragEnd}
                draggable="true"
                ref={(el) => (draggables.current[index] = el)}
                data-pos={q.pos}
                data-id={q.fragenid}
              >
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

  function handleDragStart(e) {
    e.target.classList.add("dragging");
    currentlyDraggingRef.current = e.target;
  }

  function handleDragEnd(e) {
    e.target.classList.remove("dragging");
    lastAfterElement.current = null;
  }

  function handleDragOver(e) {
    e.preventDefault();
    const afterElement = getDragAfterElement(e.clientY);
    if (lastAfterElement.current === afterElement) {
      console.log("no need to recalc");
      return;
    }
    lastAfterElement.current = afterElement;
    //find element to remove
    const removed = questionState.find(
      (e) =>
        e.fragenid ===
        parseInt(currentlyDraggingRef.current.getAttribute("data-id"))
    );
    //find new array with correct ordering without changing current state
    const resultingArray = insertBefore(
      questionState.filter(
        (e) =>
          e.fragenid !==
          parseInt(currentlyDraggingRef.current.getAttribute("data-id"))
      ),
      afterElement
        ? afterElement.getAttribute("data-pos") - 0.5
        : Number.POSITIVE_INFINITY,
      removed
    );
    //update state with new array
    setQuestions(resultingArray);
  }

  function getDragAfterElement(y) {
    //get all draggable elements
    const draggableElements = draggables.current;
    //find closest element below current dragging element and return, return undefined if at bottom
    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  function insertBefore(arr, pos, newElement) {
    const orderingBefore = arr.sort((a, b) => (a.pos <= b.pos ? -1 : 1));
    //ordered array, so can just take first result
    const insertBeforeElement = arr.findIndex((e) => e.pos > pos);
    if (insertBeforeElement < 0) {
      return indexAsPos([...orderingBefore, newElement]);
    }
    const orderingAfter = [
      ...orderingBefore.slice(0, insertBeforeElement),
      newElement,
      ...orderingBefore.slice(insertBeforeElement),
    ];
    return indexAsPos(orderingAfter);
  }
  function indexAsPos(arr) {
    return arr.map((e, index) => {
      return { ...e, pos: index };
    });
  }
};
