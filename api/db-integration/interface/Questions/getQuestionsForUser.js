const {
  questionsFromUser,
  questionsWithTags,
} = require("../../views/benutzerFragen");
function getQuestionsForUserSQL(userId, filter, limit, offset) {
  const query = `
                SELECT questionList.fragenid, questionsWithTags.titel, questionsWithTags.antworten, questionsWithTags.tags, Count(*) Over() as totalCount
                FROM
                (
                    SELECT allQuestionIds.fragenid FROM
                    (${questionsFromUser(userId)[0]}) as allQuestionIds
                    WHERE NOT allQuestionIds.fragenid IS NULL
                ) as questionList
                INNER JOIN 
                (
                    ${questionsWithTags(filter)[0]}
                ) as questionsWithTags ON questionsWithTags.fragenid =  questionList.fragenid
                ${
                  filter && filter.length > 1
                    ? `AND questionsWithTags.search ILIKE '%${filter}%'`
                    : ""
                }
                ORDER BY questionList.fragenid DESC
                ${limit ? ` LIMIT $2 ${offset ? `OFFSET $3 ` : ``}` : ``}
`;

  const params = [userId];
  //allow limit without offset but not offset without limit
  if (!limit) return [query, params];
  params.push(limit);
  if (offset) params.push(offset);
  return [query, params];

  return [query, params];
}

module.exports = {
  getQuestionsForUserSQL,
};
