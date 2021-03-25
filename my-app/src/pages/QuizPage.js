import React, { useEffect, useState } from "react";
import { NavBar } from "containers";
import { getQuiz } from "services/UserService";
import { QuizItem, EditQuiz } from "components";

export default function QuizPage() {
  useEffect(() => {
    getQuizzes(1);
  }, []);

  const [quizzes, setQuizzes] = useState();
  const [editingQuiz, setEditingQuiz] = useState({
    isEditing: false,
    quizEditing: -1,
  });
  function getQuizzes(userId) {
    getQuiz(userId, (res) => setQuizzes(res.result[0]?.quizzes));
  }
  return (
    <>
      <NavBar />
      <EditQuiz
        editingQuiz={editingQuiz}
        toggleShown={toggleEditingQuiz}
      ></EditQuiz>
      <QuizItem.QuizContainer>
        <QuizItem.NewQuizItem handleClick={handleNewQuizClick} />
        <QuizItem></QuizItem>
        <QuizItem></QuizItem>
        <QuizItem></QuizItem>
      </QuizItem.QuizContainer>
    </>
  );
  //<a>{JSON.stringify(quizzes, null, 4)}</a>
  function toggleEditingQuiz() {
    setEditingQuiz((s) => {
      return {
        ...s,
        isEditing: !s.isEditing,
        quizEditing: -1,
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
}
