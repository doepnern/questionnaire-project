import React, { useEffect, useState } from "react";
import { NavBar } from "containers";
import { QuizItem, EditQuiz } from "components";
import QuestionSelection from "containers/QuestionSelection/QuestionSelection";
import {
  useQuizState,
  addQuestionQuiz,
  deleteQuestionQuiz,
} from "hooks/useQuizState";
import { updateQuiz } from "services/UserService";

export default function QuizPage() {
  useEffect(() => {
    updateQuiz(
      {
        quizid: 1,
        beendet: false,
        titel: "timmmothey",
        fragen: [
          {
            titel: "Welches Medikament bei Verdacht auf meningitis?",
            antworten:
              '[{"text":"antwort 1 it jetzt eine sehr sehr lange antwort ","correct":true},{"text":"antwort 2","correct":false},{"text":"antwort 3","correct":false},{"text":"antwort 4","correct":false}]',
            tags: [
              {
                tagid: 1,
                tagname: "medizin",
                fragenid: 1,
              },
              {
                tagid: 2,
                tagname: "pharmakologie",
                fragenid: 1,
              },
              {
                tagid: 3,
                tagname: "alle fragen",
                fragenid: 1,
              },
              {
                tagid: 4,
                tagname: "einfach",
                fragenid: 1,
              },
              {
                tagid: 5,
                tagname: "coole sachen",
                fragenid: 1,
              },
            ],
            pos: 1,
          },
          {
            fragenid: 9,
            titel: "frage 3",
            antworten: null,
            tags: [null],
            pos: 0,
          },
        ],
      },
      1
    );
    refreshQuizzes(1);
  }, []);

  const [
    quizzes,
    setQuizzes,
    dispatch,
    refreshQuizzes,
    editingQuiz,
    setEditingQuiz,
  ] = useQuizState();
  const [questionSelection, setQuestionSelection] = useState({
    isShown: false,
  });

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
    dispatch(addQuestionQuiz(question));
  }
  function handleDeletingQuestion(question) {
    dispatch(deleteQuestionQuiz(question));
  }
}
