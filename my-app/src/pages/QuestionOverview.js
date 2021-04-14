import React, { useState, useEffect, useRef, useCallback } from "react";
import "./QuestionOverview.css";
import { getAllUsers } from "services/UserService";
import { QuestionBoxContainer, NavBar } from "containers";
import { motion } from "framer-motion";
import TestQuestionContext from "context/Test.QuestionContext";
import { useQuestionContext, addQuestion } from "context/QuestionContext";
import { myDebouncer } from "helpers/debouncer";

function QuestionOverview({ mode = "default", handleQuizAdding }) {
  const [fragenLoader, setFragenLoader] = useState({
    isLoading: true,
  });
  const [pages, setPages] = useState({ limit: 3, page: 0, maxPage: 0 });
  const setNewPage = (newIndex) =>
    setPages((p) => ({ ...p, page: Math.min(newIndex, p.maxPage) }));
  //so search in searchbar doesnt get overridden
  const lastSearch = useRef("");

  const { dispatch } = useQuestionContext();
  useEffect(() => {
    setTimeout(() => setNewPage(1), 2000);
  }, []);
  useEffect(() => {
    console.log(pages);
    getAllUsersHere();
  }, [pages.page, pages.limit]);
  useEffect(() => {
    console.log(pages);
  }, [pages.maxPage]);

  function getAllUsersHere(userId, filter) {
    userId = 1;
    if (filter != null) lastSearch.current = filter;
    //get all questions for user with userId, set QuestionState on success, TODO: set new page limit to total available results divided by limit per page
    getAllUsers(
      userId,
      { filter: lastSearch.current, limit: pages.limit, page: pages.page },
      (res) => {
        setNewQuestions(res.result);
      }
    );
    function setNewQuestions(user) {
      console.log("loaded");
      console.log(user);
      if (user !== undefined && !Object.keys(user).includes("error")) {
        const newQuestions = user.fragen != null ? user.fragen : [];
        setFragenLoader({
          ...fragenLoader,
          isLoading: false,
        });
        dispatch(addQuestion(newQuestions));
        //set new page max according to total questions available for current settings
        setPages((p) => ({
          ...p,
          maxPage:
            newQuestions.length > 0
              ? Math.floor((newQuestions[0].totalcount - 1) / p.limit)
              : 0,
        }));
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
          handleHeaderClick={
            mode === "quizAdding" ? handleQuizAdding : undefined
          }
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
