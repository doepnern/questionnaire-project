import React, { useState, useEffect, useRef, useCallback } from "react";
import "./QuestionOverview.css";
import { getAllUsers } from "services/UserService";
import { QuestionBoxContainer, NavBar } from "containers";
import { motion } from "framer-motion";
import TestQuestionContext from "context/Test.QuestionContext";
import { useQuestionContext, addQuestion } from "context/QuestionContext";
import { myDebouncer } from "helpers/debouncer";
import { usePagination } from "hooks/usePagination";

function QuestionOverview({ mode = "default", handleQuizAdding }) {
  const [fragenLoader, setFragenLoader] = useState({
    isLoading: true,
  });

  //so search in searchbar doesnt get overridden
  const lastSearch = useRef("");

  const { dispatch } = useQuestionContext();
  const {
    pages,
    setNewPage,
    setNewMaxPage,
    getPaginationDisplayList,
    setNewLimit,
  } = usePagination(19);

  //when current page, or limit per page or available max page changes, refetch data to represent changes
  useEffect(() => {
    console.log(pages);
    console.log(getPaginationDisplayList());
    getAllUsersHere();
  }, [pages.page, pages.limit, pages.maxPage]);

  function getAllUsersHere(userId, filter) {
    userId = 1;
    if (filter != null) lastSearch.current = filter;
    //get all questions for user with userId, set QuestionState on success
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
        //replace questions with newly received questions
        dispatch(addQuestion(newQuestions));
        //set new page max according to total questions available for current settings
        setNewMaxPage(newQuestions);
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
          setNewPage={setNewPage}
          getPaginationDisplayList={getPaginationDisplayList}
          setNewLimit={setNewLimit}
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
