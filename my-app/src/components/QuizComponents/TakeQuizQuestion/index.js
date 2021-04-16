import React from "react";
import "./styles.scss";
import QuestionAnswer from "../../QuestionDetailed/QuestionAnswer";
import QuestionDetailed from "../../QuestionDetailed/QuestionDetailed";

export default function TakeQuizQuestion({
  question = { title: "undefined" },
}) {
  console.log(question);
  return (
    <div className="tqq_Container">
      <div className="tqq_headerContainer">{question.titel}</div>
      <div className="tqq_BodyContainer">
        <QuestionAnswer>
          {question.antworten
            ? JSON.parse(question.antworten).map((a, index) => (
                <QuestionDetailed.SingleAnswerDefault
                  key={index}
                  answer={a}
                  handleUpdateAnswer={() =>
                    console.log("youclicked: " + a.text)
                  }
                ></QuestionDetailed.SingleAnswerDefault>
              ))
            : undefined}
        </QuestionAnswer>
      </div>
    </div>
  );
}
