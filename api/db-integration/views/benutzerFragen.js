/* get all questions for a specified user, if no user is specified, return all users with their qustions */
/*
function getBenutzerFragenView(userId) {
  const fragenTagsJoin1 = `SELECT fragen.fragenid as fragentagid, tags.tagid, tagName, titel FROM fragen, tags, fragentags  WHERE fragen.fragenid = fragentags.fragenid AND tags.tagid = fragentags.tagid`;
  const fragenTagsJoin = `SELECT fragen.fragenid, fragen.titel,fragen.antworten, fragentagjoin.tagid,fragentagjoin.tagname FROM fragen 
                          LEFT JOIN (SELECT fragentags.fragenid ,tags.tagid, tags.tagname FROM tags, fragentags WHERE tags.tagId = fragentags.tagid) AS fragentagjoin 
                          ON fragen.fragenid = fragentagjoin.fragenid`;
  const fragenTagsBenutzerJoin = `SELECT benutzerSelection.benutzerid, benutzerSelection.benutzername, fragenid,titel ,fragentagjoin.tagid, tagname FROM (${benutzerSelection()}) AS benutzerSelection, benutzerfragen, (${fragenTagsJoin}) as fragentagjoin WHERE benutzerSelection.benutzerid = benutzerfragen.benutzerid AND fragentagjoin.fragentagid = benutzerfragen.fragenid`;
  const query = `(
                 SELECT currentUser.benutzerId, currentUser.benutzername, alleFragen.fragenid, allefragen.titel,allefragen.antworten, alleFragen.tagid, alleFragen.tagname
                 FROM (${benutzerSelection()}) AS currentUser, (${fragenTagsJoin}) AS alleFragen, benutzerfragen
                 WHERE currentUser.benutzerId = benutzerFragen.benutzerId AND alleFragen.fragenId = benutzerfragen.fragenid
                 ORDER BY currentUser.benutzerId
                 );`;
  return query;
  function benutzerSelection() {
    if (userId === undefined) {
      return `SELECT * FROM benutzer`;
    } else {
      return `SELECT * FROM benutzer WHERE benutzer.benutzerId = ${userId}`;
    }
  }
}*/

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

module.exports = {
  getBenutzerFragenViewAggregate: getBenutzerFragenViewAggregate,
  fragenTagsJoin: fragenTagsJoin,
};
