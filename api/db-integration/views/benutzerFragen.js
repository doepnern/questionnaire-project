const fragenTagsJoin = `SELECT fragen.fragenid,fragen.titel,fragen.antworten, array_agg(row_to_json(fragentagjoin) ORDER BY tagid) as tags,  concat_ws(', ', fragen.titel,fragen.antworten,array_agg(fragentagjoin.tagname ORDER BY tagid)) as search
                          FROM fragen 
                          LEFT JOIN (SELECT fragentags.fragenid ,tags.tagid, tags.tagname FROM tags, fragentags WHERE tags.tagId = fragentags.tagid ORDER BY tags.tagid ASC) AS fragentagjoin 
                          ON fragen.fragenid = fragentagjoin.fragenid
                          GROUP BY fragen.fragenid
  `;

/* get all questions for a specified user, if no user is specified, return all users with their qustions */
function getBenutzerFragenViewAggregate(userId, searchString) {
  let error = false;
  const benutzerFragenJoin = `SELECT benutzerfragen.benutzerid, array_agg(row_to_json(alleFragen) ORDER BY alleFragen.fragenid ASC) as fragenArray
                            FROM benutzerfragen , (${fragenTagsJoin}) AS alleFragen
                            WHERE benutzerFragen.fragenId = alleFragen.fragenid  ${
                              searchString && searchString.length > 1
                                ? `AND alleFragen.search ILIKE '%${searchString}%'`
                                : ""
                            }
                            GROUP BY benutzerFragen.benutzerId
                            
                            `;

  const query = `(
                 SELECT currentUser.benutzerId, currentUser.benutzername, benutzerFragenJoin.fragenArray as fragen
                 FROM (${benutzerSelection()}) AS currentUser
                 LEFT JOIN (${benutzerFragenJoin}) as benutzerFragenJoin
                 ON currentUser.benutzerId = benutzerFragenJoin.benutzerId
                 ORDER BY currentUser.benutzerId ASC
                 );`;
  //array_to_string(benutzerFragenJoin.fragenArray, ' , ') as SearchString

  if (error) return undefined;
  return query;
  function benutzerSelection() {
    if (userId === undefined || userId == -1) {
      return `SELECT * FROM benutzer`;
    } else {
      if (isNaN(parseInt(userId))) {
        console.log("please only use numerical ids to select users");
        error = true;
        return "error";
      }
      return `SELECT * FROM benutzer WHERE benutzer.benutzerId = ${userId}`;
    }
  }
}

function benutzerFragenWithTags(benutzerId) {
  query = `
  SELECT currentUser.benutzerId, currentUser.benutzername, questionsWithTags.search, json_agg(
    json_build_object('fragenid',questionsWithTags.fragenid,'titel',questionsWithTags.titel,'antworten',questionsWithTags.antworten,'tags', questionsWithTags.tags) ORDER BY questionsWithTags.fragenid ASC) 
    FILTER (WHERE questionsWithTags.fragenid IS NOT null) as fragen_arr
  FROM (SELECT * FROM benutzer ${
    benutzerId ? "WHERE benutzer.benutzerid = $1 " : ""
  }) AS currentUser
  LEFT JOIN benutzerFragen ON currentUser.benutzerid = benutzerFragen.benutzerid
  LEFT JOIN (${
    questionsWithTags(true)[0]
  }) as questionsWithTags ON benutzerFragen.fragenid = questionsWithTags.fragenid
  GROUP BY currentUser.benutzerId, currentUser.benutzername, questionsWithTags.search
  ORDER BY currentUser.benutzerId ASC
  `;
  return [query, []];
}

function questionsWithTags(withSearchString = false) {
  query = `
  SELECT fragen.fragenid, fragen.titel,fragen.antworten, json_agg(
    json_build_object('tagid',tags.tagid,'tagName', tags.tagName) ORDER BY tags.tagid ASC) 
    FILTER (WHERE tags.tagid IS NOT null) as tags ${
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

module.exports = {
  getBenutzerFragenViewAggregate: getBenutzerFragenViewAggregate,
  fragenTagsJoin: fragenTagsJoin,
  questionsWithTags,
  benutzerFragenWithTags,
};
