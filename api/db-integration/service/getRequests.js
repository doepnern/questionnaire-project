const { getBenutzerFragenViewAggregate } = require("../views/benutzerFragen");
const { performQuery } = require("./db-actions");

function performGetBenutzerfragenView(userId, filter = "") {
  return performQueryWithHandling(
    getBenutzerFragenViewAggregate(userId, filter)
  );
}

async function performQueryWithHandling(query) {
  let res = await performQuery(query);
  if (res !== undefined && !res.error) {
    if (res.rowCount > 0) {
      res.rows.map((row) =>
        row.fragen ? row.fragen.map((q) => stringToArrayHandler(q)) : null
      );
      return res.rows;
    } else {
      let err =
        "Result for query is empty, userid : " + userId + "query: " + query;
      return { error: err, message: res };
    }
  } else {
    let err = "Error for query, userid : " + userId + "query: " + query;
    return { error: err, message: res };
  }
}

function stringToArrayHandler(question) {
  let string = question.antworten;
  newArray = stringToArray(string);
  question.antworten = newArray;
  return question;
}

function stringToArray(string) {
  if (!(string == null)) {
    if (string.length > 0) {
      let baseArray = JSON.parse(string);
      if (baseArray instanceof Array) {
        return baseArray;
      }
    }
  }
  return [];
}

/* //OLD FORMATTING
function formatResult(arr) {
  //get different objects without connecting them
  const tags = findAndFillObject(arr, tag, "tagid");
  const questions = findAndFillObject(arr, frage, "fragenid");
  //turn answer string into array
  questions.map((q) => stringToArrayHandler(q));
  const users = findAndFillObject(arr, user, "benutzerid");
  //connnect according to foreign keys
  appendByForeignKey(arr, questions, tags);
  appendByForeignKey(arr, users, questions);
  return users;
}

function appendByForeignKey(arr, target, source) {
  if (source.length < 1 || target.length < 1) {
    return;
  }
  for (obj of arr) {
    if (
      obj[source[0].idKeyName] !== null &&
      obj[source[0].idKeyName] !== undefined
    ) {
      let sourceObject = findById(source, obj, source[0].idKeyName);
      if (sourceObject) {
        //add sourceObject to fitting sourceObject
        let targetObject = findById(target, obj, target[0].idKeyName);
        if (targetObject) {
          if (
            !includesId(
              targetObject[targetObject.foreignList],
              sourceObject,
              sourceObject.idKeyName
            )
          ) {
            targetObject[targetObject.foreignList].push(sourceObject);
          }
        }
      }
    }
  }
}

//find all targets(objects) in array and fills them with matching keys from arr
function findAndFillObject(arr, target, targetIdKey) {
  const filledTargetList = [];
  //see if it has new target with unique id
  for (obj of arr) {
    if (!includesId(filledTargetList, obj, targetIdKey)) {
      //create new target object
      const targetInstance = new target(obj[targetIdKey]);
      addValuesByKey(targetInstance, obj);
      filledTargetList.push(targetInstance);
    }
  }
  console.log(filledTargetList);
  return filledTargetList;
}
//checks if a list contains an item with the same key: idName attribute
function includesId(list, obj, idName) {
  for (let o of list) {
    if (o[idName] === obj[idName]) {
      return true;
    }
  }
  return false;
}
//find obj with same idName value as obj.idName in list
function findById(list, obj, idName) {
  if (idName === null || idName === undefined) {
    return undefined;
  }
  for (let o of list) {
    if (o[idName] === obj[idName]) {
      return o;
    }
  }
  return undefined;
}

//adds all keys with same name from source to target
function addValuesByKey(target, source) {
  console.log("adding to target: ");
  console.log(source);
  console.log("target beforre: ");
  console.log(target);
  const targetKeys = Object.keys(target);
  for (key of Object.keys(source)) {
    // if target has the same key, add ects value
    if (targetKeys.includes(key)) {
      target[key] = source[key];
    }
  }
}

function user(benutzerid) {
  this.benutzerid = benutzerid;
  this.benutzername = "";
  this.fragen = [];
  this.idKeyName = "benutzerid";
  this.foreignList = "fragen";
}
function frage(fragenid) {
  this.fragenid = fragenid;
  this.titel = "";
  this.tags = [];
  this.antworten = "";
  this.idKeyName = "fragenid";
  this.foreignList = "tags";
}
function tag(tagid) {
  this.tagid = tagid;
  this.tagname = "";
  this.idKeyName = "tagid";
}
*/

module.exports = {
  performGetBenutzerfragenView: performGetBenutzerfragenView,
};
