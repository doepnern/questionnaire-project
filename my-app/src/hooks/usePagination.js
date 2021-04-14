import { useState } from "react";

export function usePagination(initialLimit) {
  const [pages, setPages] = useState({
    limit: initialLimit,
    page: 0,
    maxPage: 0,
  });
  //changes currently viewed page
  const setNewPage = (newIndex) =>
    setPages((p) => ({ ...p, page: Math.min(newIndex, p.maxPage) }));
  //updates the maximum viewable page according to new content
  const setNewMaxPage = (newContent) => {
    setPages((p) => {
      const newMax =
        newContent.length > 0
          ? Math.floor((newContent[0].totalcount - 1) / p.limit)
          : 0;
      return {
        ...p,
        maxPage: newMax,
        page: Math.min(p.page, newMax),
      };
    });
  };
  const setNewLimit = (newLimit) => {
    if (isNaN(parseInt(newLimit))) return;
    setPages((p) => ({ ...p, limit: parseInt(newLimit) }));
  };

  //returns displable array of pages, with first page, current page, 2 adjacent pages, last page, like: [0,-1,5,6,7,-1,20], -1 is placeholder for multiple values
  const getPaginationDisplayList = () => {
    const pagesList = [0];
    for (let i = 1; i <= pages.maxPage; i++) {
      if (i === pages.maxPage) {
        pagesList.push(i);
      } else if ([pages.page, pages.page - 1, pages.page + 1].includes(i)) {
        pagesList.push(i);
      } else if (!(pagesList[pagesList.length - 1] === -1)) {
        pagesList.push(-1);
      }
    }
    const pagesListPretty = pagesList.map((e) =>
      e >= 0 ? `${e}` : `${"..."}`
    );
    const limitList = [...Array.from(Array(29).keys()).map((x) => x + 1)];
    return {
      pagesList,
      pagesListPretty,
      currentPage: pages.page,
      limitList: limitList,
    };
  };
  return {
    pages,
    setNewPage,
    setNewMaxPage,
    getPaginationDisplayList,
    setNewLimit,
  };
}
