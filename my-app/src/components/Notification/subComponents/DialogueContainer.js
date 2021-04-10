import React from "react";
import Fade from "../../Misc/Fade/Fade";
import { useNotificationContext } from "../NotificationContext";
import "../styles/dialogue.css";
export default function InformationOverlayContainer() {
  const { notificationContext } = useNotificationContext();
  return (
    <Fade
      zIndex={2001}
      show={notificationContext.dialogue.status === "selecting"}
      MyDivProp={ScreenOverlayComponent}
    >
      <div className="dialogue_container" style={{ pointerEvents: "all" }}>
        <div className="textDiv">
          <p>{notificationContext.dialogue.message}</p>
        </div>
        <div className="buttonDiv">
          {notificationContext.dialogue.options.map((opt, index) => {
            let idAttr = "dialogue_button";
            if (index === notificationContext.dialogue.options?.length - 1) {
              idAttr = "dialogue_button_red";
            }
            return (
              <button
                onClick={() => {
                  opt.handleClick();
                  notificationContext.dialogue.onSuccess();
                }}
                id={idAttr}
                key={index}
              >
                <p>{opt.name}</p>
              </button>
            );
          })}
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
