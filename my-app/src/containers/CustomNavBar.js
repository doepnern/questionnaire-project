import React from "react";
import { NavBar } from "components";

export default function CustomNavBar({ withSearch = false, searchFunction }) {
  return (
    <NavBar>
      <NavBar.Header shortText={"MyQ"}>MyQuestionnaire</NavBar.Header>
      <NavBar.Item shortText={"Edit"} link="/">
        Edit questions
      </NavBar.Item>
      <NavBar.Item shortText={"Quiz"} link="/quiz">
        Questionnaire
      </NavBar.Item>
      {withSearch && <NavBar.SearchBar handleChange={searchFunction} />}
    </NavBar>
  );
}
