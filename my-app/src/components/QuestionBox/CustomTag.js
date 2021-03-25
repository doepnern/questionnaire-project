import React, { useEffect, useRef, useState } from "react";
import "./customTag.scss";
import { ReactComponent as RemoveTagSVG } from "svg/remove_tag.svg";
import { ReactComponent as AddTagSVG } from "svg/add_tag.svg";
//Custom styled tag, children is text inside tag
export function CustomTag({ handleRemoveTagClicked, children, ...restProps }) {
  return (
    <div className="CustomTag" {...restProps}>
      <p>{children}</p>
      <RemoveTagSVG onClick={handleRemoveTagClicked}></RemoveTagSVG>
    </div>
  );
}

CustomTag.AddTag = function CustomTagAddTag({ handleAddingTag, ...restProps }) {
  const tagRef = useRef();
  const [open, setOpen] = useState({
    open: false,
    disabled: false,
    value: "",
  });

  return (
    <div
      className={
        open.open ? "CustomTag addTag addTagClicked" : "CustomTag addTag"
      }
      id="addTag"
      onClick={() => {
        if (!open.open && !open.disabled) {
          setOpen((o) => {
            return { ...o, open: true, disabled: false };
          });
          tagRef.current.focus();
        } else {
          handleAddInputClose();
        }
      }}
      {...restProps}
    >
      <AddTagSVG></AddTagSVG>
      <div className="inputAddTag">
        <input
          onClick={(e) => e.stopPropagation()}
          ref={tagRef}
          type="text"
          placeholder="new tag"
          onBlur={open.open ? handleAddInputClose : undefined}
          onKeyDown={(e) =>
            e.key == "Enter" ? handleAddInputClose() : undefined
          }
          onChange={(e) => {
            const val = e.target.value;
            setOpen((o) => {
              return { ...o, value: val };
            });
          }}
          value={open.value}
        />
      </div>
    </div>
  );
  function handleAddInputClose() {
    console.log("closed");
    handleAddingTag(open.value);
    setOpen((o) => {
      return { ...o, open: false, disabled: true, value: "" };
    });
    //prevent click on plus to trigger another open
    setTimeout(() => {
      setOpen((o) => {
        return { ...o, disabled: false };
      });
    }, 300);
  }
};
