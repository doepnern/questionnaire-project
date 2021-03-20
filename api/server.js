const express = require("express");
const path = require("path");

const app = express(),
  bodyParser = require("body-parser");
port = 3080;
const { handleAddingTagToQuestion } = require("./controller/tagHandler");
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
  try {
    getQuestions(req.params.id, query).then((ret) => {
      console.log(ret);
      res.json(ret);
    });
  } catch (err) {
    res.json({
      error: `couldnt get user view with id ${req.params.id}`,
      message: err.message,
    });
  }
});

app.get("/api/users", (req, res) => {
  const query = req.query.filter ? req.query.filter : "";
  console.log("api/users called without id");
  console.log("returning:");
  try {
    getQuestions(req.params.id, query).then((ret) => {
      console.log(ret);
      res.json(ret);
    });
  } catch (err) {
    res.json({ error: "couldnt get user view", message: err.message });
  }
});

//updates database with question list given
app.post("/api/questions", (req, res) => {
  console.log("-----------------------------------");
  console.log("updating questions:", req.body);
  try {
    updateQuestions(req.body).then((ret) => {
      res.json({ status: "success", ret: ret });
    });
  } catch (err) {
    res.json({ status: "error", msg: err.message });
  }
});

app.get("/api/users/:id/addQuestion", (req, res) => {
  console.log("requested to add question for user " + req.params.id);
  try {
    createNewQuestion(req.params.id).then((result) => {
      if (result.error) {
        res.json(result);
      } else {
        res.json({ status: "success", result: result });
      }
    });
  } catch (err) {
    res.json({ status: "error", msg: err.message });
  }
});

app.get("/api/questions/deleteQuestion/:id", (req, res) => {
  try {
    deleteQuestionById(req.params.id).then((result) => {
      if (result.error) {
        res.json(result);
      } else {
        res.json({ status: "success", result: result });
      }
    });
  } catch (err) {
    res.json({ status: "error", msg: err.message });
  }
});

app.get("/api/questions/deleteTag/:tagid", (req, res) => {
  let fragenid = req.query.fragenid;
  console.log(fragenid);
  try {
    deleteTagById(req.params.tagid, fragenid).then((result) => {
      if (result.error) {
        res.json(result);
      } else {
        res.json({ status: "success", result: result });
      }
    });
  } catch (err) {
    res.json({ status: "error", msg: err.message });
  }
});

app.get(`/api/questions/:questionId/addTag/:tagName`, (req, res) => {
  handleAddingTagToQuestion(req.params.tagName, req.params.questionId)
    .then((result) => {
      if (result.error) {
        res.json(result);
      } else {
        res.json({ status: "success", result: result });
      }
    })
    .catch((err) => res.json({ status: "error", msg: err.message }));
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-app/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
