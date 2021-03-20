import React, { useEffect, useRef, useState } from "react";
import "./questionBox.scss";
import { motion } from "framer-motion";
import { ReactComponent as AddButton } from "svg/plus_button.svg";
import { ReactComponent as TrashButton } from "svg/trash_button.svg";
import { CustomTag } from "./CustomTag";

/**
 * QuestionBoxLayout:
 * QuestionBox
 * QuestionBoxheader
 * QuestionBoxBody
 * QuestionBox
 */

export default function QuestionBox({ children, ...restProps }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="Container"
      {...restProps}
    >
      {children}
    </motion.div>
  );
}

QuestionBox.Header = function QuestionBoxHeader({ children, ...restProps }) {
  return (
    <div className="HeaderContainer" {...restProps}>
      {children}
    </div>
  );
};

QuestionBox.Body = function QuestionBoxBody({ children, ...restProps }) {
  return (
    <div className="BodyContainer" {...restProps}>
      {children}
    </div>
  );
};

QuestionBox.Title = function QuestionBoxTitle({
  children,
  classNameAdd = "",
  ...restProps
}) {
  let className = "TitleDiv";
  return (
    <div
      className={[className, className + classNameAdd].join(" ")}
      {...restProps}
    >
      {children}
    </div>
  );
};

QuestionBox.Text = function QuestionBoxText({
  children,
  classNameAdd = "",
  ...restProps
}) {
  let className = "TextDiv";
  return (
    <div
      className={[className, className + classNameAdd].join(" ")}
      {...restProps}
    >
      <p>{children}</p>
    </div>
  );
};

QuestionBox.TextEditing = function QuestionBoxTextEditing({
  children,
  currentText = "",
  handleBlur,
  ...restProps
}) {
  const initialText = useRef(undefined);
  const [inputText, setInput] = useState(currentText);
  const inputRef = useRef(undefined);
  //update the input field when the prop text changes
  useEffect(() => {
    initialText.current = currentText;
    if (inputRef.current) {
      inputRef.current.selectionStart = inputRef.current.value.length;
      inputRef.current.selectionEnd = inputRef.current.value.length;
      inputRef.current.focus();
    }
  }, []);
  useEffect(() => {
    if (initialText.current !== currentText) {
      setInput(currentText);
    }
  }, [currentText]);
  return (
    <div className=" TextDiv TextDiv-detailed">
      <textarea
        ref={inputRef}
        className={"qb_textEditing"}
        value={inputText}
        type="text"
        onChange={(e) => setInput(e.target.value)}
        onBlur={handleBlur}
      />
    </div>
  );
};

QuestionBox.Tags = function QuestionBoxTags({
  handleRemoveTagClicked,
  handleAddingTag,
  children,
  tags,
  ...restProps
}) {
  return (
    <div className="QuestionBoxTagsContainer">
      <div className="TagsTitle">Tags:</div>
      <div className="TagsContainer">
        <CustomTag.AddTag handleAddingTag={handleAddingTag}></CustomTag.AddTag>
        {tags.map((tag, index) => {
          return (
            tag && (
              <CustomTag
                handleRemoveTagClicked={() => handleRemoveTagClicked(tag.tagid)}
                key={tag.tagid}
              >
                {tag.tagname}
              </CustomTag>
            )
          );
        })}
      </div>
    </div>
  );
};

QuestionBox.NewQuestion = function QuestionBoxNewQuestion() {
  return (
    <div className="qb_addButtonContainer">
      <div className="qb_addButtonTitle">Add new question</div>
      <div className="qb_addButton">
        <AddButton title="add new question" />
      </div>
    </div>
  );
};

QuestionBox.DeleteContainer = function QuestionBoxDeleteContainer({
  handleClick,
  ...restProps
}) {
  return (
    <div className="qb_deleteContainer" onClick={handleClick}>
      <TrashButton></TrashButton>
    </div>
  );
};
