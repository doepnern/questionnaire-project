import { displayDialogue, closeDialogue } from "./NotificationContext";
//default confirmation dialogue with yes and cancel button where yes performs the onSuccess function and cancel performs the onCancel function and then closes the dialogue
export function confirmationDialogue(msg, dispatch, onSuccess, onCancel) {
  return dispatch(
    displayDialogue(msg, [
      {
        name: "Cancel",
        handleClick: () => {
          if (onCancel) onCancel();
          dispatch(closeDialogue(msg));
        },
      },
      {
        name: "Yes",
        handleClick: () => {
          if (onSuccess) onSuccess();
          dispatch(closeDialogue(msg));
        },
        style: "warning",
      },
    ])
  );
}
