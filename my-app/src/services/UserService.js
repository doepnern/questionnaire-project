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
/*export async function createUser(data) {
    const response = await fetch(`/api/user`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({user: data})
      })
    return await response.json();
}*/
