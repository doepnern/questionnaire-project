//check if userId is valid int outside this function
function getUserInfoSQL(userId) {
  const query = `SELECT * from benutzer WHERE benutzer.benutzerid = $1`;
  const params = [userId];
  return [query, params];
}

module.exports = {
  getUserInfoSQL,
};
