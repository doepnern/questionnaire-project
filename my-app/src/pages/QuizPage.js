import React, { useEffect, useState } from "react";
import { NavBar } from "containers";
import { getQuiz } from "services/UserService";
import { QuizItem, EditQuiz } from "components";
import QuestionSelection from "containers/QuestionSelection/QuestionSelection";
import {
  insertIfNotContained,
  removeIfContained,
} from "helpers/QuestionHelpers/QuestionStorage/questionInterface";

export default function QuizPage() {
  useEffect(() => {
    getQuizzes(1);
  }, []);

  const [quizzes, setQuizzes] = useState([]);
  const [editingQuiz, setEditingQuiz] = useState({
    isEditing: false,
    quizEditing: -1,
  });
  const [questionSelection, setQuestionSelection] = useState({
    isShown: false,
  });
  function getQuizzes(userId) {
    getQuiz(userId, (res) => {
      setQuizzes(res.result[0]?.quizzes);
    });
  }

  return (
    <>
      <NavBar />
      <EditQuiz
        editingQuiz={editingQuiz}
        toggleShown={toggleEditingQuiz}
        quizzes={quizzes}
        handleAddClick={toggleQuestionSelection}
        handleTrashClick={handleDeletingQuestion}
      ></EditQuiz>
      <QuestionSelection
        questionSelection={questionSelection}
        toggleShown={toggleQuestionSelection}
        handleQuizAdding={handleQuizAdding}
      ></QuestionSelection>
      <QuizItem.QuizContainer>
        <QuizItem.NewQuizItem handleClick={handleNewQuizClick} />
        {quizzes.map((quiz) => (
          <QuizItem
            key={quiz.quizid}
            handleEditClick={() => toggleEditingQuiz(quiz.quizid)}
            quiz={quiz}
            {...quiz}
          />
        ))}
      </QuizItem.QuizContainer>
    </>
  );

  // toggles editing screen and sets currently editing id to quizid
  function toggleEditingQuiz(id) {
    setEditingQuiz((s) => {
      return {
        ...s,
        isEditing: !s.isEditing,
        quizEditing: id ? id : -1,
      };
    });
  }

  // toggles screen to add questions
  function toggleQuestionSelection() {
    setQuestionSelection((s) => {
      return {
        ...s,
        isShown: !s.isShown,
      };
    });
  }

  // opens edit quiz dialogue and sets quizEditing to -1 -> if that is id at close -> need to let db create new quiz
  function handleNewQuizClick() {
    //TODO: create new quiz and get new quizzes id
    setEditingQuiz((s) => {
      return {
        ...s,
        isEditing: true,
        quizEditing: -1,
      };
    });
  }

  //adds a question to a quiz
  function handleQuizAdding(question) {
    /* console.log(
      "TODO: add question: " +
        JSON.stringify(question, null, 4) +
        " to quiz " +
        editingQuiz.quizEditing
    ); */
    if (editingQuiz.quizEditing === -1) return;
    let currentQuiz = findQuiz(quizzes, editingQuiz.quizEditing);
    setQuizzes((s) =>
      replaceQuizWithId(s, {
        ...currentQuiz,
        fragen: insertIfNotContained(currentQuiz.fragen, question),
      })
    );
    console.log(JSON.stringify(quizzes, null, 3));
  }

  //deletes given question from currently editing quiz
  function handleDeletingQuestion(question) {
    if (question == null) return;
    let currentQuiz = findQuiz(quizzes, editingQuiz.quizEditing);
    setQuizzes((s) =>
      replaceQuizWithId(s, {
        ...currentQuiz,
        fragen: removeIfContained(currentQuiz.fragen, question),
      })
    );
  }
}

function findQuiz(arr, quizid) {
  return arr.find((e) => e.quizid === quizid);
}
function replaceQuizWithId(arr, quiz) {
  let target = arr.findIndex((e) => e.quizid === quiz.quizid);
  if (target < 0) return [...arr];
  return [...arr.slice(0, target), quiz, ...arr.slice(target + 1)];
}
