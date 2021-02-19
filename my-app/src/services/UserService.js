export async function getAllUsers() {
  const response = await fetch("/api/users");
  return await response.json();
}

export async function updateQuestions(newQuestions, onSuccess, onError) {
  const options = {
    method: "POST",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(newQuestions),
  };
  const response = await fetch("/api/questions", options);
  const result = await response.json();
  console.log(result);
  if (result.status === "success" && onSuccess) {
    onSuccess();
  } else {
    if (onError) onError();
  }
  return result;
}

export async function createQuestionForUser(userId) {
  try {
    const response = await fetch(`/api/users/${userId}/addQuestion`);
    if (response.error) {
      console.log(
        "failed to create question for user " +
          userId +
          ", backend reported error"
      );
      console.log(response);
      return response;
    } else {
      return response;
    }
  } catch (e) {
    console.log(
      "failed to create question for user " + userId + ", backend unreachable"
    );
    return {
      error:
        "failed to create question for user " +
        userId +
        ", backend unreachable",
    };
  }
}

export async function deleteQuestionByid(questionId) {
  try {
    const response = await fetch(`/api/questions/deleteQuestion/${questionId}`);
    if (response.error) {
      console.log(
        "failed to delete question with id " +
          questionId +
          ", backend reported error:"
      );
      console.log(response);
      return response;
    } else {
      console.log(response);
      return response;
    }
  } catch (e) {
    console.log(
      "failed to delete question with id " +
        questionId +
        ", backend unreachable"
    );
    return {
      error:
        "failed to delete question with id " +
        questionId +
        ", backend unreachable",
    };
  }
}
