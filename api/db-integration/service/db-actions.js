const { Client } = require("pg");

/* returns insert querysfor the given values in object, also works with array of objects */
function insertInto(tableName, values) {
  if (values instanceof Array) {
    res = [];
    values.forEach((v) => res.push(insertInto(tableName, v)));
    return res;
  }
  const valArray = [];
  for (let val of Object.values(values)) {
    valArray.push(val);
  }
  return `INSERT INTO ${tableName} Values(${valArray.join()});`;
}

/* returns select query for given keys from table, keys can be array */
function selectTable(tableName, keys) {
  if (keys === undefined) {
    return `SELECT * FROM ${tableName};`;
  } else if (keys instanceof Array) {
    return `SELECT ${keys.join()} FROM ${tableName};`;
  } else {
    return `SELECT ${keys} FROM ${tableName};`;
  }
}

//performs a single/ array of querys asynchronus, resolves promise after all querys are done
async function performQuery(query, optionalParams) {
  if (query instanceof Array) {
    let arrRes = await (async () => {
      let results = [];
      for (let q of query) {
        let r = [{ error: "no query performed of multiple querys" }];
        if (q instanceof Array) {
          r = await performQuery(...q);
        } else {
          r = await performQuery(q);
        }
        if (r.error) {
          return r;
        }
        results.push(r);
      }
      return { resultsMultiple: results };
    })();
    return arrRes;
  }
  if (!query) {
    console.log("undefined Query");
    return { error: "undefined query" };
  }
  const client = new Client();
  try {
    await client.connect();
    const res = await client.query(query, optionalParams);
    if (res) {
      console.log("performed query " + res.command);
      for (let row of res.rows) {
        console.log(row);
      }
      client.end();
      return res;
    }
  } catch (err) {
    if (err.code === "42P07") {
      console.log("Table already existing");
    } else {
      console.error(err);
    }
    client.end();
    return {
      error: "failed query, either on connection or on performing query",
      message: err,
    };
  } finally {
    client.end();
  }
}

module.exports = {
  insertInto: insertInto,
  selectTable: selectTable,
  performQuery: performQuery,
};
