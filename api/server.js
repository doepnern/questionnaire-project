const express = require("express");
const path = require("path");

const app = express(),
  bodyParser = require("body-parser");
port = 3080;
const { handleAddingTagToQuestion, getQuiz } = require("./controller");
const {
  initDB,
  updateQuestions,
  createNewQuestion,
  deleteQuestionById,
  deleteTagById,
  getQuestions,
} = require("./db-integration");

//enable env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//initialize db
initDB();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../my-app/build")));

app.get("/api/users/:id", (req, res) => {
  const query = req.query.filter ? req.query.filter : "";
  handleRequest(() => getQuestions(req.params.id, query), res);
});

app.get("/api/users", (req, res) => {
  const query = req.query.filter ? req.query.filter : "";
  console.log("api/users called without id");
  console.log("returning:");
  handleRequest(() => getQuestions(req.params.id, query), res);
});

//updates database with question list given
app.post("/api/questions", (req, res) => {
  console.log("-----------------------------------");
  console.log("updating questions:", req.body);
  handleRequest(() => updateQuestions(req.body), res);
});
app.get("/api/users/:id/addQuestion", (req, res) => {
  console.log("requested to add question for user " + req.params.id);
  handleRequest(() => createNewQuestion(req.params.id), res);
});

app.get("/api/questions/deleteQuestion/:id", (req, res) => {
  handleRequest(() => deleteQuestionById(req.params.id), res);
});

app.get("/api/questions/deleteTag/:tagid", (req, res) => {
  let fragenid = req.query.fragenid;
  handleRequest(() => deleteTagById(req.params.tagid, fragenid), res);
});

app.get(`/api/questions/:questionId/addTag/:tagName`, (req, res) => {
  handleRequest(
    () => handleAddingTagToQuestion(req.params.tagName, req.params.questionId),
    res
  );
});

app.get("/api/quiz", (req, res) => {
  handleRequest(() => getQuiz(req.query.userId), res);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-app/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

function handleRequest(request, res) {
  request()
    .then((result) => {
      if (result.error) {
        res.json(result);
      } else {
        res.json({ status: "success", result: result });
      }
    })
    .catch((err) => {
      console.warn(err);
      res.json({ status: "error", msg: err.message });
    });
}
