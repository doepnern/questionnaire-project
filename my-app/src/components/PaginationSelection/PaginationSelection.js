import React from "react";
import "./paginationSelection.scss";

export default function PaginationSelection({
  pages = [],
  currentPage = -100,
  handlePageClick = () => undefined,
  limitList = [],
  handleLimitChange = () => undefined,
}) {
  return (
    <div className="pgs_pgsContainer">
      <select name="limitSelection" onChange={handleLimitChange}>
        <option value="">limit:</option>
        {limitList.map((l, index) => (
          <option key={index} value={l}>
            {l}
          </option>
        ))}
      </select>
      {pages.map((p, index) => (
        <div
          className={`pgs_singlePageContainer ${
            currentPage.toString() === p ? "currentlySelected" : ""
          }`}
          onClick={
            !isNaN(parseInt(p))
              ? () => handlePageClick(parseInt(p))
              : () => undefined
          }
          key={index}
        >
          {p}
        </div>
      ))}
    </div>
  );
}
