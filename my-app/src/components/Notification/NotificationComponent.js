import React from "react";
import { NotificationContextProvider } from "./NotificationContext";
import DialogueContainer from "./subComponents/DialogueContainer";
import InformationOverlayContainer from "./subComponents/InformationOverlayContainer";

export default function NotificationComponent({ children }) {
  return (
    <NotificationContextProvider>
      <DialogueContainer></DialogueContainer>
      <InformationOverlayContainer></InformationOverlayContainer>
      {children}
    </NotificationContextProvider>
  );
}
