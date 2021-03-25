/**
 *
 * Callable functions
 */
export function getAllUsers(userId, filter, onSuccess, onError) {
  return dispatchUserService(
    getAllUsersRequest(userId, filter),
    onSuccess,
    onError
  );
}

export function getQuiz(userId, onSuccess, onError) {
  return dispatchUserService(getQuizRequest(userId), onSuccess, onError);
}

export async function updateQuestions(newQuestions, onSuccess, onError) {
  return dispatchUserService(
    updateQuestionsRequest(newQuestions),
    onSuccess,
    onError
  );
}

export async function createQuestionForUser(userId, onSuccess, onError) {
  return dispatchUserService(
    createQuestionForUserRequest(userId),
    onSuccess,
    onError
  );
}

export async function deleteQuestionByid(questionId, onSuccess, onError) {
  return dispatchUserService(
    deleteQuestionByidRequest(questionId),
    onSuccess,
    onError
  );
}

export async function deleteTagById(tagId, questionid, onSuccess, onError) {
  return dispatchUserService(
    deleteTagByIdRequest(tagId, questionid),
    onSuccess,
    onError
  );
}

//adds to question, creates new tag if one with name doesnt exist
export async function addTagForQuestion(
  tagName,
  questionId,
  onSuccess,
  onError
) {
  return dispatchUserService(
    addTagForQuestionRequest(tagName, questionId),
    onSuccess,
    onError
  );
}

/**
 *
 * Request builders
 */

function getAllUsersRequest(userId, filter) {
  return {
    name: `get user: ${userId}, with filter: ${filter}`,
    request: () =>
      fetch(
        "/api/users" +
          (userId ? "/" + userId : "") +
          (filter ? "?filter=" + filter : "")
      ),
  };
}

function getQuizRequest(userId) {
  return {
    name: `get quiz for user ${userId}`,
    request: () => fetch(`/api/quiz${userId ? `?userId=${userId}` : ""}`),
  };
}

function updateQuestionsRequest(newQuestions) {
  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newQuestions),
  };
  return {
    name: `updating questions : ` + newQuestions,
    request: () => fetch("/api/questions", options),
  };
}

function createQuestionForUserRequest(userId) {
  return {
    name: `creating question for user ${userId}`,
    request: () => fetch(`/api/users/${userId}/addQuestion`),
  };
}

function deleteQuestionByidRequest(questionId) {
  return {
    name: `deleting question by id : ` + questionId,
    request: () => fetch(`/api/questions/deleteQuestion/${questionId}`),
  };
}

function deleteTagByIdRequest(tagId, questionid) {
  return {
    name: `deleting tag by id: ` + tagId,
    request: () =>
      fetch(
        `/api/questions/deleteTag/${tagId}${
          questionid ? `?fragenid=${questionid}` : ""
        }`
      ),
  };
}

function addTagForQuestionRequest(tagName, questionId) {
  return {
    name: `creating/adding tag: ${tagName
      .split(" ")
      .join("_")} for question with id: ${questionId}`,
    request: () => fetch(`/api/questions/${questionId}/addTag/${tagName}`),
  };
}
/**
 *
 * Basic calling and error handling
 */
async function dispatchUserService(action, onSuccess, onError) {
  try {
    const response = await action.request();
    const jsonResponse = await response.json();
    if (jsonResponse.error || jsonResponse?.status === "error") {
      console.log(
        "failed action: " + action.name + ", backend reported error:"
      );
      console.log(jsonResponse);
      if (onError) onError(jsonResponse);
    } else {
      if (onSuccess) onSuccess(jsonResponse);
      return jsonResponse;
    }
  } catch (e) {
    console.log(
      "failed " +
        action.name +
        ", backend unreachable on " +
        JSON.stringify(action)
    );
    console.log(e);
    if (onError) onError(e);
  }
}
