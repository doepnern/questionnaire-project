/* get all questions for a specified user, if no user is specified, return all users with their qustions */
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
}

/* get all questions for a specified user, if no user is specified, return all users with their qustions */
function getBenutzerFragenViewAggregate(userId) {
  let error = false;
  const fragenTagsJoin = `SELECT fragen.fragenid,fragen.titel,fragen.antworten, array_agg(row_to_json(fragentagjoin)) as tags FROM fragen 
                          LEFT JOIN (SELECT fragentags.fragenid ,tags.tagid, tags.tagname FROM tags, fragentags WHERE tags.tagId = fragentags.tagid) AS fragentagjoin 
                          ON fragen.fragenid = fragentagjoin.fragenid
                          GROUP BY fragen.fragenid`;
  const benutzerFragenJoin = `SELECT benutzerfragen.benutzerid, array_agg(row_to_json(alleFragen)) as fragenArray
                            FROM benutzerfragen, (${fragenTagsJoin}) AS alleFragen
                            WHERE benutzerFragen.fragenId = alleFragen.fragenid
                            GROUP BY benutzerFragen.benutzerId`;

  const query = `(
                 SELECT currentUser.benutzerId, currentUser.benutzername, benutzerFragenJoin.fragenArray as fragen
                 FROM (${benutzerSelection()}) AS currentUser
                 LEFT JOIN (${benutzerFragenJoin}) as benutzerFragenJoin
                 ON currentUser.benutzerId = benutzerFragenJoin.benutzerId
                 ORDER BY currentUser.benutzerId
                 );`;

  if (error) return undefined;
  return query;
  function benutzerSelection() {
    if (userId === undefined) {
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
  getBenutzerFragenView: getBenutzerFragenView,
  getBenutzerFragenViewAggregate: getBenutzerFragenViewAggregate,
};
