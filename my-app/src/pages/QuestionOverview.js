import React, { useState, useEffect, useRef, useCallback } from "react";
import "./QuestionOverview.css";
import { getAllUsers } from "services/UserService";
import { QuestionBoxContainer } from "containers";
import { motion } from "framer-motion";
import TestQuestionContext from "context/Test.QuestionContext";
import { useQuestionContext, addQuestion } from "context/QuestionContext";
import NavBar from "components/NavBar/NavBar";
import { myDebouncer } from "helpers/debouncer";

function QuestionOverview() {
  const [fragenLoader, setFragenLoader] = useState({
    isLoading: true,
  });
  const { dispatch } = useQuestionContext();
  function getAllUsersHere(userId, filter) {
    getAllUsers(userId, filter).then((users) => {
      console.log("loaded");
      console.log(users);
      if (users !== undefined && !Object.keys(users).includes("error")) {
        const newQuestions = users[0].fragen;
        setFragenLoader({
          ...fragenLoader,
          isLoading: false,
        });
        dispatch(addQuestion(newQuestions != null ? newQuestions : []));
      } else {
        getAllUsersHere();
      }
    });
  }
  const debouncedGetUsers = useCallback(myDebouncer(getAllUsersHere, 150), [
    getAllUsersHere,
  ]);
  useEffect(getAllUsersHere, []);

  return (
    <div className="questionOverview">
      <NavBar>
        <NavBar.Header shortText={"MyQ"}>MyQuestionnaire</NavBar.Header>
        <NavBar.Item shortText={"Edit"}>Edit questions</NavBar.Item>
        <NavBar.Item shortText={"Quiz"}>Questionnaire</NavBar.Item>
        <NavBar.SearchBar
          handleChange={(e) => debouncedGetUsers(undefined, e.target.value)}
        />
      </NavBar>
      {!fragenLoader.isLoading ? (
        <QuestionBoxContainer
          reloadQuestions={getAllUsersHere}
        ></QuestionBoxContainer>
      ) : (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 2 }}
        >
          Im loading...
        </motion.div>
      )}
    </div>
  );
}

export default QuestionOverview;
