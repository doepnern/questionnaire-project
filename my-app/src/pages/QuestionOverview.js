import React, { useState, useEffect, useRef, useCallback } from "react";
import "./QuestionOverview.css";
import { getAllUsers } from "services/UserService";
import { QuestionBoxContainer, NavBar } from "containers";
import { motion } from "framer-motion";
import TestQuestionContext from "context/Test.QuestionContext";
import { useQuestionContext, addQuestion } from "context/QuestionContext";
import { myDebouncer } from "helpers/debouncer";

function QuestionOverview() {
  const [fragenLoader, setFragenLoader] = useState({
    isLoading: true,
  });
  //so search in searchbar doesnt get overridden
  const lastSearch = useRef("");

  const { dispatch } = useQuestionContext();

  function getAllUsersHere(userId, filter) {
    if (filter != null) lastSearch.current = filter;
    getAllUsers(userId, lastSearch.current, (res) =>
      setNewQuestions(res.result)
    );
    function setNewQuestions(users) {
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
        setTimeout(() => getAllUsersHere(), 1000);
      }
    }
  }
  const debouncedGetUsers = useCallback(myDebouncer(getAllUsersHere, 150), [
    getAllUsersHere,
  ]);
  useEffect(getAllUsersHere, []);

  return (
    <div className="questionOverview">
      <NavBar
        withSearch={true}
        searchFunction={(e) => debouncedGetUsers(undefined, e.target.value)}
      />
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
