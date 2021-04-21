import React, { useEffect, useRef } from "react";
import {
  useQuestionContext,
  addQuestion,
  updateQuestion,
} from "./QuestionContext";
import { myDebouncer } from "helpers/debouncer";
import { myFunctionTimer } from "helpers/functionTimer";

export default function TestQuestionContext() {
  const { questionContext, dispatch } = useQuestionContext();
  const testRef = useRef(
    new tests(getExamples(), [addQuestion, updateQuestion])
  );
  useEffect(() => {
    console.log("Test for QuestionContext enabled:");
    //debounceTest();
  }, []);
  useEffect(() => {
    console.log("change in question context detected");
    console.log("new questionContext");
    console.log(questionContext);
    testRef.current.performNext((e) => dispatch(e));
  }, [questionContext]);
  return <></>;
}

// function webFrage(id) {
//   this.fragenid = id;
//   this.titel = "";
//   this.antworten = "";
//   this.tags = [];
// }
// function tag(id) {
//   this.tagid = id;
//   this.tagname = "";
// }
function getExamples() {
  const examples = [
    {
      test: {
        fragenid: 1,
        titel: "beispielfrage 1",
        antworten: `"["antwort 1 it jetzt eine sehr sehr lange antwort ","antwort 2","antwort 3","antwort 4"]"`,
        tags: [{ tagid: 1, tagname: "erster tag" }],
      },
      functionIndex: 0,
      msg: "first test: adding question 1",
    },
    {
      test: {
        fragenid: 1,
        titel: "beispielfrage 1",
        antworten: `"["antwort 1 it jetzt eine sehr sehr lange antwort ","antwort 2","antwort 3","antwort 4"]"`,
        tags: [{ tagid: 1, tagname: "erster tag" }],
      },
      functionIndex: 0,
      msg: "second test: adding duplicate",
    },
    {
      test: {
        fragenid: 2,
        titel: "beispielfrage 2",
        antworten: `"["antwort 1 it jetzt eine sehr sehr lange antwort ","antwort 2","antwort 3","antwort 4"]"`,
        tags: [{ tagid: 2, tagname: "zweiter tag" }],
      },
      functionIndex: 0,
      msg: "second test: adding second question",
    },
    {
      test: {
        fragenid: 2,
        titel: " geupdatete beispielfrage 2",
        antworten: `"["geupdatete antwort 1 it jetzt eine sehr sehr lange antwort ","antwort 2","antwort 3","antwort 4"]"`,
        tags: [{ tagid: 20, tagname: "geupdateterzweiter tag" }],
      },
      functionIndex: 1,
      msg: "third test: updating second question",
    },
    {
      test: {
        fragenid: 1,
      },
      functionIndex: 2,
      msg: "fourth test: deleting first question",
    },
  ];
  return examples;
}

function tests(testArray, functionArray) {
  this.testNumber = 0;
  this.testArray = testArray;
  this.functions = functionArray;
}
tests.prototype.getNext = function () {
  this.testNumber++;
  return this.testArray[this.testNumber - 1];
};
tests.prototype.performNext = function (dispatchFunction) {
  let nextTest = this.getNext();
  if (nextTest) {
    console.log(nextTest.msg);
    dispatchFunction(this.functions[nextTest.functionIndex](nextTest.test));
  } else console.log("reached end of tests");
};

// function debounceTest() {
//   //testing function
//   function testingDebounce(s) {
//     console.log(s);
//   }
//   let myTest = myDebouncer(testingDebounce, 10);
//   let myTimerTest = myFunctionTimer((n) => {
//     let x = 0;
//     for (let i = 0; i < n; i++) {
//       x = x * x;
//     }
//     return x;
//   });
//   setTimeout(() => myTest("second hi"), 0);
//   setTimeout(() => myTest("third hi"), 0);
//   setTimeout(() => myTest("fourth hi"), 0);
//   myTimerTest(100000);
//   myTimerTest(10);
// }
