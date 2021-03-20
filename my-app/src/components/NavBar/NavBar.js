import "./NavBar.scss";
import React from "react";
import { ReactComponent as SearchIcon } from "svg/search_icon.svg";

export default function NavBar({ children, ...restProps }) {
  return (
    <>
      <div className="NavBarContainer" {...restProps}>
        {children}
      </div>
    </>
  );
}

NavBar.Header = function NavBarHeader({ children, shortText, ...restProps }) {
  return (
    <div className="NavHeader">
      <span className="NavFull">{children}</span>
      <span className="NavShort">{shortText ? shortText : children}</span>
    </div>
  );
};

NavBar.Item = function NavBarItem({ children, shortText, ...restProps }) {
  return (
    <div className="NavItem" {...restProps}>
      <span className="NavFull">{children}</span>
      <span className="NavShort">{shortText ? shortText : children}</span>
    </div>
  );
};

NavBar.SearchBar = function NavBarSearchBar({ handleChange, ...restProps }) {
  return (
    <div className="NavSearchBar" {...restProps}>
      <div className="inputIconContainer">
        <SearchIcon />
      </div>
      <div className="inputContainer">
        <input type="text" placeholder="search" onChange={handleChange} />
      </div>
    </div>
  );
};
