import React, { useEffect, useState } from "react";
import "./questionDetailed.scss";
import { motion, AnimatePresence } from "framer-motion";
import QuestionAnswer from "./QuestionAnswer";
import { ReactComponent as EditAnswerButton } from "svg/edit_button.svg";
import { ReactComponent as TrashButton } from "svg/trash_button.svg";
import "components/Animations/Fade/styles.css";

export default function QuestionDetailed() {
  return <></>;
}

QuestionDetailed.Container = function QuestionDetailedContainer({
  children,
  isShown,
  toggleShown,
  ...restProps
}) {
  return (
    <>
      <AnimatePresence>
        {isShown && (
          <motion.div
            className="Modal"
            onClick={toggleShown}
            transition={{ duration: 0.1 }}
            animate="shown"
            initial="hidden"
            exit={{ opacity: "0%" }}
            variants={animationModalVariants()}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="questionDetailedContainer"
              animate={{ opacity: "100%" }}
              initial={{
                opacity: "0%",
              }}
              exit={{ opacity: "0%" }}
            >
              {children}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  function animationModalVariants() {
    return {
      hidden: {
        opacity: "0%",
        width: "0%",
        height: "0%",
        top: "0%",
        left: "50%",
      },
      shown: {
        opacity: "100%",
        width: "100%",
        height: "100%",
        top: "50%",
        left: "50%",
      },
    };
  }
};

QuestionDetailed.SingleAnswerDefault = function QuestionDetailedSingleAnswer({
  answer,
  handleClickTrash,
  handleClickEditButton,
  handleUpdateAnswer,
  ...restProps
}) {
  return (
    <QuestionAnswer.SingleAnswer
      handleAnswerClick={() => handleUpdateAnswer({ correct: !answer.correct })}
      activated={answer.correct}
      {...restProps}
    >
      <QuestionAnswer.AnswerTextContainer>
        <p>{answer.text}</p>
      </QuestionAnswer.AnswerTextContainer>
      <QuestionAnswer.Button handleClick={handleClickEditButton}>
        <EditAnswerButton />
      </QuestionAnswer.Button>
      <QuestionAnswer.Button handleClick={handleClickTrash}>
        <TrashButton />
      </QuestionAnswer.Button>
    </QuestionAnswer.SingleAnswer>
  );
};

QuestionDetailed.SingleAnswerEditing = function QuestionDetailedSingleAnswer({
  answer,
  handleClickTrash,
  handleUpdateAnswer,
  handleClickEditButton,
  ...restProps
}) {
  return (
    <QuestionAnswer.SingleAnswer
      handleAnswerClick={() => handleUpdateAnswer({ correct: !answer.correct })}
      activated={answer.correct}
      {...restProps}
    >
      <QuestionAnswer.EditAnswerTextContainer
        answerText={answer.text}
        updateAnswer={(e) => {
          handleUpdateAnswer({ text: e.target.value });
          handleClickEditButton(e);
        }}
      />
      <QuestionAnswer.Button handleClick={handleClickEditButton}>
        <EditAnswerButton />
      </QuestionAnswer.Button>
      <QuestionAnswer.Button handleClick={handleClickTrash}>
        <TrashButton />
      </QuestionAnswer.Button>
    </QuestionAnswer.SingleAnswer>
  );
};

//Single answer, depending on editing, either as default or as editing version
QuestionDetailed.VariableSingleAnswer = function QuestiondetailedSingleVariableAnswer({
  answer,
  handleClick,
  handleUpdateAnswer,
  wasJustAdded = false,
  ...restProps
}) {
  const [editing, setEditing] = useState(wasJustAdded);
  const [animation, playAnimation] = useState({
    animation: wasJustAdded ? "appear" : "",
    active: wasJustAdded ? true : false,
  });

  function handleClickTrash(e) {
    e.stopPropagation();
    playAnimation((s) => {
      return {
        ...s,
        animation: "collapse",
        active: true,
      };
    });
    setTimeout(() => {
      playAnimation((s) => {
        return {
          ...s,
          animation: "",
          active: false,
        };
      });
      handleClick();
    }, 250);
  }

  return (
    <>
      {editing ? (
        <QuestionDetailed.SingleAnswerEditing
          style={{
            animationName: `${animation.active ? animation.animation : ""}`,
            animationDuration: "0.27s",
          }}
          answer={answer}
          handleClickTrash={handleClickTrash}
          handleUpdateAnswer={handleUpdateAnswer}
          handleClickEditButton={(e) => {
            e.stopPropagation();
            setEditing((s) => !s);
            playAnimation((s) => {
              return { ...s, animation: "", active: "false" };
            });
          }}
        ></QuestionDetailed.SingleAnswerEditing>
      ) : (
        <QuestionDetailed.SingleAnswerDefault
          handleUpdateAnswer={handleUpdateAnswer}
          style={{
            animationName: `${animation.active ? animation.animation : ""}`,
            animationDuration: "0.27s",
          }}
          answer={answer}
          handleClickTrash={handleClickTrash}
          handleClickEditButton={(e) => {
            e.stopPropagation();
            setEditing((s) => !s);
          }}
        ></QuestionDetailed.SingleAnswerDefault>
      )}
    </>
  );
};
