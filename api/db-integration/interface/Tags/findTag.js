const { performQuery } = require("../../service/db-actions");
const { isInt } = require("../../../my_util");
//finds all tags with fitting id or tagname, not both
async function findTag(tagId, tagName) {
  if (tagId) {
    //see if tagId is valid int
    if (isInt(tagId)) {
      let res = await performQuery(...findTagByIdSQL(tagId));
      return res;
    }
  }
  if (tagName) {
    if (typeof tagName == "string" && tagName.length > 0) {
      let res = await performQuery(...findTagByName(tagName));
      return res;
    }
  }
  return {
    error:
      "error trying to find tag with id: " + tagId + " or tagName " + tagName,
  };
}

function findTagByIdSQL(tagId) {
  const query = `Select * FROM Tags 
                 WHERE Tags.tagid = $1
                `;
  const params = [tagId];
  return [query, params];
}

function findTagByName(tagName) {
  const query = `SELECT * FROM tags 
                 WHERE tags.tagName = $1
                `;
  const params = [tagName];
  return [query, params];
}

module.exports = {
  findTag: findTag,
};
