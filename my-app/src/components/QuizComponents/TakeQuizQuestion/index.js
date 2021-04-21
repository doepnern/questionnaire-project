import React from "react";
import "./styles.scss";
import QuestionAnswer from "../../QuestionDetailed/QuestionAnswer";
import QuestionDetailed from "../../QuestionDetailed/QuestionDetailed";
import Button from "@material-ui/core/Button";

export default function TakeQuizQuestion({
  question = { title: "undefined", index: -1, beantwortet: false },
  handleClickAnswer,
  handleSubmitClick,
  buttonText = "Undefinded",
}) {
  return (
    <div className="tqq_Container">
      <div className="tqq_headerContainer">
        <div className="tqq_headerLeft">
          <h1>{question.index}</h1>
        </div>
        <div className="tqq_headerRight">
          <h3>{question.titel}</h3>
        </div>
      </div>
      <div className="tqq_BodyContainer">
        <QuestionAnswer>
          {question.antworten
            ? question.antworten.map((a, index) => (
                <QuestionDetailed.SingleAnswerTakeQuiz
                  key={index}
                  answer={a}
                  handleAnswerClick={() => handleClickAnswer(a, question)}
                  checkCorrectness={question.beantwortet}
                  selected={question.ausgewaehlteAntworten.some((id) =>
                    a.id ? id === a.id : false
                  )}
                ></QuestionDetailed.SingleAnswerTakeQuiz>
              ))
            : undefined}
        </QuestionAnswer>
      </div>
      <div className="tqq_footerContainer">
        <Button
          onClick={() => handleSubmitClick(question)}
          variant="contained"
          size="large"
          color="primary"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
}
