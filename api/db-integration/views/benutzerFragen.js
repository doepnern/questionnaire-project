const { isInt } = require("../../my_util/index");

function questionsWithTags(withSearchString = false) {
  query = `
  SELECT fragen.fragenid, fragen.titel,fragen.antworten, json_agg(
    CASE WHEN tags.tagid IS NULL THEN null ELSE
    json_build_object('tagid',tags.tagid,'tagname', tags.tagName, 'fragenid', fragen.fragenid) END ORDER BY tags.tagid ASC) 
    as tags ${
      withSearchString
        ? ", concat_ws(', ', fragen.titel,fragen.antworten,array_agg(tags.tagname ORDER BY tags.tagid)) as search "
        : ""
    }
  FROM fragen
  LEFT JOIN fragenTags ON fragen.fragenid = fragenTags.fragenid
  LEFT JOIN Tags ON fragenTags.tagid = Tags.tagid
  GROUP BY fragen.fragenid
  `;
  return [query, []];
}

//returns query to get all questionIds for given userId
function questionsFromUser(userId, limit, offset) {
  const query = `
  SELECT currentBenutzerFragen.fragenid
  FROM (SELECT * FROM benutzer ${
    isInt(userId) ? "WHERE benutzer.benutzerid = $1 " : ""
  }) AS currentUser
  LEFT JOIN benutzerFragen as currentBenutzerFragen ON currentUser.benutzerid = currentBenutzerFragen.benutzerid 
  ORDER BY currentBenutzerFragen.fragenid
  ${isInt(limit) && isInt(offset) ? `LIMIT ${limit} OFFSET ${offset}` : ""}
  `;
  //still need to group by user and aggregate questions
  const params = [];
  if (isInt(userId)) params.push(userId);
  return [query, params];
}

module.exports = {
  questionsWithTags,
  questionsFromUser,
};
