import React, { useEffect } from "react";
import Fade from "../../Misc/Fade/Fade";
import { useNotificationContext } from "../NotificationContext";
import "../styles/dialogue.scss";

export default function InformationOverlayContainer() {
  const { notificationContext } = useNotificationContext();
  useEffect(() => {
    console.log({ notificationContext }, [notificationContext]);
  });
  return (
    <Fade
      zIndex={2001}
      show={notificationContext.dialogue.status === "selecting"}
      MyDivProp={ScreenOverlayComponent}
    >
      <div className="dialogue_container" style={{ pointerEvents: "all" }}>
        <div className="dialogueHeader">
          <div className="textDiv">
            <span>{notificationContext.dialogue.message}</span>
          </div>
        </div>
        <div className="dialogueFooter">
          <div className="buttonDiv">
            {notificationContext.dialogue.options.map((opt, index) => {
              let idAttr = "dialogue_button";
              if (index === notificationContext.dialogue.options?.length - 1) {
                idAttr = "dialogue_button red";
              }
              return (
                <button
                  onClick={() => {
                    opt.handleClick();
                  }}
                  className={idAttr}
                  key={index}
                >
                  <span>{opt.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </Fade>
  );
}
function ScreenOverlayComponent({ children, ...restProps }) {
  return (
    <div className="ScreenOverlayCenter" {...restProps}>
      {children}
    </div>
  );
}
