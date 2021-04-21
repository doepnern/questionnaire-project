import React, { useEffect, useRef } from "react";
/**
 * Create draggable autosorting list by passing in a state consisting of objects where each object has a pos key and an id key, whose name can be specified in stateId property
 * As Children only ListDrag.Items are valid to be dragged, give those their respective id as dataId, their pos as dataPos and their index in the current state as index property
 * the state will be set whenever the ordering changes and all pos attributes will be updated respectively without duplicates( they will have form: pos: 0 -> pos: 1 ...)
 * */
export default function ListDrag({
  className,
  children,
  state,
  setState,
  stateId = "id",
  nodeRef,
}) {
  const currentState = useRef(state);
  const draggables = useRef([]);
  const container = useRef(null);
  const currentlyDraggingRef = useRef(null);
  //for performance reasons save last after element, so recalculating of positions only needs to be done if afterElement changes
  const lastAfterElement = useRef(null);
  const myProps = {
    onDragOver: handleDragOver,
    ref: container,
    className: className,
  };

  useEffect(() => {
    if (nodeRef && nodeRef.current) {
      console.log("node got passed, using this instead of creating div");
      nodeRef.current.addEventListener("dragover", handleDragOver);
      myProps["ref"] = nodeRef;
      if (className) nodeRef.current.classList.add(className);
      //turn every child div into draggable element, each child div has to have data-pos and data-id defined
      nodeRef.current.childNodes.forEach((cn) => {
        draggables.current.push(cn);
        cn.addEventListener("dragstart", handleDragStart);
        cn.addEventListener("dragend", handleDragEnd);
        cn.setAttribute("draggable", true);
        cn.classList.add("draggable");
      });
      return () => {
        draggables.current = [];
        nodeRef.current.removeEventListener("dragover", handleDragOver);
        nodeRef.current.childNodes.forEach((cn) => {
          cn.removeEventListener("dragstart", handleDragStart);
          cn.removeEventListener("dragend", handleDragEnd);
          cn.classList.remove("draggable");
        });
      };
    }
  }, [state]);
  useEffect(() => {
    currentState.current = state;
  }, [state]);
  return (
    <>
      {!nodeRef && (
        <div {...myProps}>
          {addPropsToChildren(children, {
            draggables: draggables,
            handleDragStart,
            handleDragEnd,
          })}
        </div>
      )}
      {nodeRef && <>{children}</>}
    </>
  );

  //adds needed props to ListDragItems
  function addPropsToChildren(childs, props) {
    if (!childs || !(childs instanceof Array)) return childs;
    return childs.map((child) => {
      if (child.type === ListDrag.Item) {
        // checking isValidElement
        if (React.isValidElement(child)) {
          return React.cloneElement(child, props);
        }
      }
      return child;
    });
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
      return;
    }
    lastAfterElement.current = afterElement;
    //find element to remove
    const removed = currentState.current.find(
      (e) =>
        e[stateId] ===
        parseInt(currentlyDraggingRef.current.getAttribute("data-id"))
    );
    // if nothing got removed, dont add anything
    if (!removed || removed.length < 0) {
      console.warn(
        "couldnt find the element you are currently dragging in your state, make sure you specify the stateId to the correct key and the dataId prop of your draggable elements"
      );
      return;
    }
    //find new array with correct ordering without changing current state
    const resultingArray = insertBefore(
      currentState.current.filter(
        (e) =>
          e[stateId] !==
          parseInt(currentlyDraggingRef.current.getAttribute("data-id"))
      ),
      afterElement
        ? afterElement.getAttribute("data-pos") - 0.5
        : Number.POSITIVE_INFINITY,
      removed
    );
    //update state with new array
    setState(resultingArray);
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
}

ListDrag.Item = function ListDragItem({
  className,
  dataPos,
  dataId,
  index,
  children,
  handleDragStart,
  handleDragEnd,
  draggable = "true",
  draggables,
  ...restProps
}) {
  const myProps = {
    ref: draggables ? (el) => (draggables.current[index] = el) : undefined,
    className: className + " draggable",
    draggable: draggable,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd,
    ...restProps,
  };
  myProps["data-id"] = dataId;
  myProps["data-pos"] = dataPos;

  return <div {...myProps}>{children}</div>;
};
