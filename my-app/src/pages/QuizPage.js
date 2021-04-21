import React, { useEffect, useState } from "react";
import { NavBar } from "containers";
import { QuizItem, EditQuiz } from "components";
import QuestionSelection from "containers/QuestionSelection/QuestionSelection";
import {
  useQuizState,
  addQuestionQuiz,
  deleteQuestionQuiz,
} from "hooks/useQuizState";
import { deleteQuiz as dispatchDeleteQuiz } from "services/UserService";
import { useNotificationContext, displayMessage } from "components";
import { useHistory } from "react-router-dom";

export default function QuizPage() {
  const { dispatch: dispatchNotification } = useNotificationContext();
  useEffect(() => {
    refreshQuizzes(1);
    dispatchNotification(
      displayMessage(
        "successfully did something you wanted",
        "error",
        dispatchNotification,
        20000
      )
    );
  }, []);

  const [
    quizzes,
    setQuizzes,
    dispatch,
    refreshQuizzes,
    editingQuiz,
    setEditingQuiz,
    {
      updateCurrentlyEditingQuiz,
      updateQuiz,
      getQuestionsInQuiz,
      calcQuizResult,
    },
  ] = useQuizState();
  const [questionSelection, setQuestionSelection] = useState({
    isShown: false,
  });

  const history = useHistory();
  return (
    <>
      <NavBar />
      <EditQuiz
        editingQuiz={editingQuiz}
        toggleShown={toggleEditingQuiz}
        quizzes={quizzes}
        handleAddClick={toggleQuestionSelection}
        handleTrashClick={handleDeletingQuestion}
        updateCurrentlyEditingQuiz={updateCurrentlyEditingQuiz}
      ></EditQuiz>
      <QuestionSelection
        questionSelection={questionSelection}
        toggleShown={toggleQuestionSelection}
        handleQuizAdding={handleQuizAdding}
        questionsInQuiz={getQuestionsInQuiz()}
      ></QuestionSelection>
      <QuizItem.QuizContainer>
        <QuizItem.NewQuizItem handleClick={handleNewQuizClick} />
        {quizzes.map((quiz) => (
          <QuizItem
            key={quiz.quizid}
            completed={quiz.beendet}
            score={quiz.score}
            progress={quiz.progress}
            handleDeleteClick={() => handleDeletingQuiz(quiz.quizid)}
            handleEditClick={() => toggleEditingQuiz(quiz.quizid)}
            handleContinueClick={() => history.push(`/quiz/try/${quiz.quizid}`)}
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
      if (s.isEditing) refreshQuizzes(1);
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
    updateQuiz({ quizid: -1, beendet: false, titel: "new quiz" }, 1, (res) => {
      if (
        res.status === "success" &&
        res.result &&
        res.result[0]?.rows[0]?.quizid
      ) {
        setEditingQuiz((s) => {
          return {
            ...s,
            isEditing: true,
            quizEditing: res.result[0].rows[0].quizid,
          };
        });
      } else console.log("newly created quiz cant be found");
    });
  }

  function handleDeletingQuiz(quizid) {
    dispatchDeleteQuiz(quizid, () => refreshQuizzes(1));
  }

  //adds a question to a quiz
  function handleQuizAdding(question) {
    dispatch(addQuestionQuiz(question));
  }
  function handleDeletingQuestion(question) {
    dispatch(deleteQuestionQuiz(question));
  }
}
