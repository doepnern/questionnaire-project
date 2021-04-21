const { performQuery } = require("../../service/db-actions");
const { isInt } = require("../../../my_util");

//deletes tag by id if it exists, if given questionId, tag only gets deleted from question
async function deleteTagById(tagId, questionId) {
  //see if questionId is valid int
  if (isInt(tagId)) {
    let res;
    if (questionId && isInt(questionId)) {
      res = await performQuery(
        ...deleteFragenTagsByQuestionSQL(tagId, questionId)
      );
    } else {
      res = await performQuery([
        [...deleteFragenTags(tagId)],
        [...deleteTagSQL(tagId)],
      ]);
    }
    return res;
  } else {
    return {
      error:
        "question could not be deleted, please specify a valid questionId of type int",
    };
  }
}

function deleteTagSQL(tagId) {
  const query = `DELETE FROM Tags 
                 WHERE Tags.tagid = $1
                `;
  const params = [tagId];
  return [query, params];
}

function deleteFragenTags(tagId) {
  const query = `DELETE FROM fragentags 
                 WHERE fragentags.tagid = $1
                `;
  const params = [tagId];
  return [query, params];
}

function deleteFragenTagsByQuestionSQL(tagId, fragenId) {
  const query = `DELETE FROM fragentags 
                 WHERE fragentags.tagid = $1 AND fragentags.fragenid = $2
                `;
  const params = [tagId, fragenId];
  return [query, params];
}

module.exports = {
  deleteTagById: deleteTagById,
};
