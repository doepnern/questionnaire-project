const { isInt } = require("../my_util");
const { findTag, createTag, performQuery } = require("../db-integration/index");

//adds tag with tagname to question, if tag doest exists, creates tag, replace spaces with underscore in request
async function handleAddingTagToQuestion(tagName, questionId) {
  //verify tagName and questionId
  if (!(typeof tagName === "string" && tagName.length > 0 && isInt(questionId)))
    throw new Error(
      "wrong format for tagName: " + tagName + " or questionId: " + questionId
    );
  //for now assume question with id exists, TODO: check if question with id exists
  //try to find tag with name, replace underscore with space
  tagName = tagName.split("_").join(" ");
  const tagFound = await findTag(undefined, tagName);
  let newTagId;
  //falls tag nicht vorhanden, tag erstellen
  if (tagFound.rowCount == 0) {
    const res = await createTag(tagName);
    if (res.error) return res;
    newTagId = res.rows[0].tagid;
  } else {
    newTagId = tagFound.rows[0].tagid;
  }
  //add tag to question
  let result = await performQuery("INSERT INTO fragentags VALUES($1,$2)", [
    questionId,
    newTagId,
  ]);
  return result;
}

module.exports = {
  handleAddingTagToQuestion: handleAddingTagToQuestion,
};
