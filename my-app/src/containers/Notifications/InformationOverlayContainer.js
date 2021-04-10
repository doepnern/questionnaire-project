import React, { useEffect } from "react";
import { InformationOverlayDiv, Fade } from "components";
import { useNotificationContext } from "context/NotificationContext";
export default function InformationOverlayContainer() {
  const { notificationContext } = useNotificationContext();
  useEffect(() => {
    console.log(notificationContext);
  }, [notificationContext]);
  return (
    <Fade
      zIndex={2001}
      show={notificationContext.notification.active}
      MyDivProp={ScreenOverlayComponent}
    >
      <InformationOverlayDiv
        style={{
          backgroundColor: getBgColor(notificationContext.notification.style),
          color: getTxtColor(notificationContext.notification.style),
        }}
      >
        {notificationContext.notification.message}
      </InformationOverlayDiv>
    </Fade>
  );
  function getBgColor(style = "information") {
    switch (style) {
      case "information":
        return "#314978";
      case "error":
        return "rgba(164, 40, 40, 0.85)";
      default:
        return "#314978";
    }
  }
  function getTxtColor(style = "information") {
    switch (style) {
      case "information":
        return "#dde1ff";
      case "error":
        return "#dde1ff";
      default:
        return "#dde1ff";
    }
  }
}
function ScreenOverlayComponent({ children, ...restProps }) {
  return (
    <div className="ScreenOverlayBottom" {...restProps}>
      {children}
    </div>
  );
}
