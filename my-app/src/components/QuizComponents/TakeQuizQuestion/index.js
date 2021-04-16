import React, { useState, useEffect } from "react";
import "./styles.scss";
import QuestionAnswer from "../../QuestionDetailed/QuestionAnswer";
import QuestionDetailed from "../../QuestionDetailed/QuestionDetailed";
import Button from "@material-ui/core/Button";

export default function TakeQuizQuestion({
  question = { title: "undefined", index: -1 },
}) {
  console.log(question);
  const [submitted, setSubmitted] = useState({ state: false });
  useEffect(() => {
    setSubmitted({ state: false });
  }, [question.index]);
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
            ? JSON.parse(question.antworten).map((a, index) => (
                <QuestionDetailed.SingleAnswerTakeQuiz
                  key={index}
                  answer={a}
                  handleAnswerClick={() => console.log("youclicked: " + a.text)}
                  checkCorrectness={submitted.state}
                ></QuestionDetailed.SingleAnswerTakeQuiz>
              ))
            : undefined}
        </QuestionAnswer>
      </div>
      <div className="tqq_footerContainer">
        <Button
          onClick={() => setSubmitted({ state: true })}
          variant="contained"
          size="large"
          color="primary"
        >
          Check
        </Button>
      </div>
    </div>
  );
}
