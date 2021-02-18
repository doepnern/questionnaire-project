const { exception } = require("console");
const express = require("express");
const path = require("path");
const app = express(),
  bodyParser = require("body-parser");
port = 3080;
const { initDB, getUserView, updateQuestions } = require("./db-integration");

//enable env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//initialize db
initDB();
// place holder for the data
const users = [];

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "../my-app/build")));

app.get("/api/users/:id", (req, res) => {
  console.log("api/users called with id : " + req.params.id + "!");
  console.log("returning:");
  try {
    getUserView(req.params.id).then((ret) => {
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
  console.log("api/users called without id");
  console.log("returning:");
  try {
    getUserView().then((ret) => {
      console.log(ret);
      res.json(ret);
    });
  } catch (err) {
    res.json({ error: "couldnt get user view", message: err.message });
  }
});

app.post("/api/questions", (req, res) => {
  console.log("-----------------------------------");
  //console.log("updating questions:", newQuestions);
  try {
    updateQuestions(req.body);
  } catch (err) {
    res.json({ status: "error", msg: err.message });
  }
  res.json({ status: "success" });
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../my-app/build/index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});
