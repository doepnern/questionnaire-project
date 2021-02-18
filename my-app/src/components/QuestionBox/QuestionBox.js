import React from "react";
import "./questionBox.css";
import { motion } from "framer-motion";

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
      <p {...restProps}>{children}</p>
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

QuestionBox.Tags = function QuestionBoxTags({ children, tags, ...restProps }) {
  return (
    <div className="QuestionBoxTagsContainer">
      <div className="TagsTitle">Tags:</div>
      <div className="TagsContainer">
        {tags.map((tag, index) => {
          return tag && <CustomTag key={index}>{tag.tagname}</CustomTag>;
        })}
      </div>
    </div>
  );
};

function CustomTag({ children, ...restProps }) {
  return <div className="CustomTag">{children}</div>;
}
