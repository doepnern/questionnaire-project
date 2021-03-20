const { performQuery } = require("../../service/db-actions");
//creates new tag, returns tagId of newTag
async function createTag(tagName) {
  let res = await performQuery(...createTagSQL(tagName));
  return res;
}

function createTagSQL(tagName) {
  const query = `
                 INSERT INTO Tags 
                 VALUES (DEFAULT,
                 $1)
                  RETURNING tagid
                `;
  const params = [tagName];
  return [query, params];
}

module.exports = {
  createTag: createTag,
};
