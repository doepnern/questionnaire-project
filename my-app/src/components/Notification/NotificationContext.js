import React, { useReducer } from "react";
import { useContext } from "react";

//different text styles(error, etc) for the global Overlay Messages
const INFORMATION = "information";
// use "error" for alternative styling const ERROR = "error";

export const NotificationContext = React.createContext();

const initialState = {
  notification: {
    active: false,
    message: "",
    style: INFORMATION,
  },
  dialogue: {
    status: "idle",
    message: "",
    options: [
      {
        name: "yes",
        handleClick: () =>
          console.log("please add success callback to dialogue"),
      },
      {
        name: "cancel",
        handleClick: () =>
          console.log("please add decline callback to dialogue"),
        style: "warning",
      },
    ],
  },
};

//Constants for types of actions
const DISPLAY_MESSAGE = "displayMessage";
const RESET = "reset";
const REMOVE_MESSAGE = "removeMessage";
const DISPLAY_DIALOGUE = "displayDialogue";
const CLOSE_DIALOGUE = "closeDialogue";

/* displays a message in selected styles for selected timeperiod */
function displayMessage(message, style = INFORMATION, dispatch, callbackTime) {
  if (dispatch && callbackTime)
    setTimeout(() => dispatch(removeMessage(message)), callbackTime);
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
  onSuccess,
  onDecline
) {
  //by default first item gets onSuccess and lastItem gets onDecline callbacks, if you want custom callbacks define them in options
  const optionsWithoutFirstAndLast = options.slice(1, options.length - 1);
  const optionsWithCallback = [
    addCallbackIfDefined(options[0], onSuccess),
    ...optionsWithoutFirstAndLast,
    addCallbackIfDefined(options[options.length - 1], onDecline),
  ];
  return { type: DISPLAY_DIALOGUE, message, options: optionsWithCallback };
}

function addCallbackIfDefined(obj, callback) {
  if (callback) {
    return { ...obj, handleClick: callback };
  }
  return obj;
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
