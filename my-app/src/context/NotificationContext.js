import React, { useReducer } from "react";
import { useContext } from "react";

export const NotificationContext = React.createContext();

//different text styles(error, etc) for the global Overlay Messages
const INFORMATION = "information";
// use "error" for alternative styling const ERROR = "error";

const initialState = {
  notification: {
    active: false,
    message: "",
    style: INFORMATION,
  },
  dialogue: {
    status: "idle",
    message: " are you sure deleting all overlays?",
    options: [
      { name: "yes", handleClick: () => null },
      { name: "cancel", handleClick: () => null },
    ],
    onSuccess: () => console.log("please add success callback to dialogue"),
  },
};

//Constants for types of actions
const DISPLAY_MESSAGE = "displayMessage";
const RESET = "reset";
const REMOVE_MESSAGE = "removeMessage";
const DISPLAY_DIALOGUE = "displayDialogue";
const CLOSE_DIALOGUE = "closeDialogue";

/* displays a message in selected styles for selected timeperiod */
function displayMessage(message, style = INFORMATION, callback, callbackTime) {
  if (callback && callbackTime)
    setTimeout(() => callback(removeMessage(message)), callbackTime);
  return { type: DISPLAY_MESSAGE, message, style };
}
/* removes if specified message is currently displayed */
function removeMessage(message) {
  return { type: REMOVE_MESSAGE, message };
}
/* resets messages */
function reset() {
  return { type: RESET };
}
/** displays a dialogue box with given message and selection options, on success calls onSuccess function */
function displayDialogue(
  message,
  options = initialState.dialogue.options,
  onSuccess = initialState.onSuccess
) {
  return { type: DISPLAY_DIALOGUE, message, options, onSuccess };
}

function closeDialogue(message) {
  return { type: CLOSE_DIALOGUE, message };
}

function NotificationContextReducer(state, action) {
  switch (action.type) {
    case DISPLAY_MESSAGE:
      return {
        ...state,
        notification: {
          active: true,
          message: action.message,
          style: action.style,
        },
      };
    default:
      return state;
    case REMOVE_MESSAGE:
      if (
        state.notification.active === true &&
        state.notification.message === action.message
      ) {
        return {
          ...state,
          notification: {
            ...initialState.notification,
          },
        };
      } else return { ...state };
    case DISPLAY_DIALOGUE:
      return {
        ...state,
        dialogue: {
          ...state.dialogue,
          status: "selecting",
          message: action.message,
          options: action.options,
          onSuccess: action.onSuccess,
        },
      };
    case CLOSE_DIALOGUE:
      return {
        ...state,
        dialogue: {
          ...initialState.dialogue,
        },
      };
    case RESET:
      return { ...initialState };
  }
}

function NotificationContextProvider(props) {
  const [notificationContext, dispatch] = useReducer(
    NotificationContextReducer,
    initialState
  );
  const value = { notificationContext, dispatch };
  return <NotificationContext.Provider value={value} {...props} />;
}

function useNotificationContext() {
  return useContext(NotificationContext);
}

export {
  useNotificationContext,
  NotificationContextProvider,
  displayMessage,
  removeMessage,
  reset,
  displayDialogue,
  closeDialogue,
};
