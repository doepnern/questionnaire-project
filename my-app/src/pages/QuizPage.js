import React, { useEffect, useState } from "react";
import { NavBar } from "containers";
import { getQuiz } from "services/UserService";
import { QuizItem, EditQuiz } from "components";
import QuestionSelection from "containers/QuestionSelection/QuestionSelection";

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
  //<a>{JSON.stringify(quizzes, null, 4)}</a>
  function toggleEditingQuiz(id) {
    setEditingQuiz((s) => {
      return {
        ...s,
        isEditing: !s.isEditing,
        quizEditing: id ? id : -1,
      };
    });
  }
  function toggleQuestionSelection() {
    setQuestionSelection((s) => {
      return {
        ...s,
        isShown: !s.isShown,
      };
    });
  }
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

  function handleQuizAdding(question) {
    console.log(
      "TODO: add question: " +
        JSON.stringify(question, null, 4) +
        " to quiz " +
        editingQuiz.quizEditing
    );
  }
}
