const _ = require("lodash");

/**
 * minimum question
 * question:
 * {
 *  fragenid: int,
 *  tags: [string]
 *  antworten: [{text: String, correct: bool}]
 *  }
 */

//valid types for Question Keys:
export const typesQuestion = {
  fragenid: (x) => isInt(x),
  titel: (x) => typeof x === "string",
  tags: (x) =>
    x instanceof Array &&
    x.every(
      (y) =>
        //TODO: remove null values
        y === null ||
        (typeof y === "object" &&
          isInt(y.fragenid) &&
          isInt(y.tagid) &&
          typeof y.tagname === "string")
    ),
  antworten: (x) =>
    x instanceof Array &&
    x.every(
      (y) =>
        typeof y === "object" &&
        typeof y.text === "string" &&
        typeof y.correct === "boolean"
    ),
};

//valid types for Answer Keys
export const typesAnswer = {
  text: (x) => typeof x === "string",
  correct: (x) => typeof x === "boolean",
  id: (x) => !isNaN(parseInt(x)),
};

//makes sure returned object has all needed keys to be a question and none, not belonging to question, also checks for correct format of updated keys, throws error in case of unfitting format, object needs at least key: fragenid
export function questionFromObject(obj) {
  // obj at least needs a fragenId
  if (!obj.fragenid || !isInt(obj.fragenid)) {
    throw new Error(
      "not a valid fragenid, make sure object for questionFromObject has key: fragenid with valid Integer value"
    );
  }
  const newQuestion = new createQuestion(parseInt(obj.fragenid));
  const finalQuestion = updateObjectKeysWithTypeChecking(
    newQuestion,
    {
      ...obj,
      fragenid: parseInt(obj.fragenid),
    },
    typesQuestion
  );
  return finalQuestion;
}

export function addAnswer(question) {
  let q = _.cloneDeep(question);
  q.antworten.push(new createAnswer(question));
  return { obj: q, changes: 1 };
}

export function updateAnswer(question, index, antwort) {
  let q = _.cloneDeep(question);
  if (!q.antworten[index])
    throw new Error("antworten array not available at position index");
  const newAnswer = updateObjectKeysWithTypeChecking(
    q.antworten[index],
    antwort,
    typesAnswer
  );
  q.antworten[index] = newAnswer.obj;
  return { obj: q, changes: newAnswer.changes };
}

export function deleteAnswer(question, index) {
  let q = _.cloneDeep(question);
  if (!q.antworten[index])
    throw new Error("antworten array not available at position index");
  const newA = [
    ...q.antworten.slice(0, index),
    ...q.antworten.slice(index + 1),
  ];
  return { obj: { ...q, antworten: newA }, changes: 1 };
}

//updates given keys of question, only returns new question if question is valid format afterwards
export function updateQuestion(question, update) {
  const newQ = updateObjectKeysWithTypeChecking(
    question,
    update,
    typesQuestion
  );
  return newQ;
}

//inserts into an array of questions the question q only if no question with the same id exists
export function insertIfNotContained(arr, q) {
  if (arr === null) return [q];
  if (arr.every((e) => e.fragenid !== q.fragenid)) {
    return [...arr, q];
  }
  return arr;
}

export function removeIfContained(arr, q) {
  if (arr === null) return [];
  let target = arr.findIndex((e) => e.fragenid === q.fragenid);
  if (target < 0) return [...arr];
  return [...arr.slice(0, target), ...arr.slice(target + 1)];
}

/**
 *
 * HElPER FUNCTIONS
 */

//checks whether for given object, keys from type exist and are valid format, returns the result and keys with wron keys
export function keyTypesAreValid(obj, type) {
  const failures = [];
  const result = Object.keys(type).reduce(
    (agg, key) => {
      let myRes = obj.hasOwnProperty(key) && type[key](obj[key]);
      return {
        res: myRes && agg.res,
        failures: !myRes
          ? [
              ...agg.failures,
              `${key}, value: ${JSON.stringify(obj[key], null, 4)}`,
            ]
          : agg.failures,
      };
    },
    { res: true, failures: failures }
  );
  return result;
}
//checks whether obj and type have exactly the same keys, doesnt check for correct types
export function hasExactlySameKeys(obj, type) {
  return _.isEqual(Object.keys(obj), Object.keys(type));
}

//dont use this constructor directly, use questionFromObject instead
export const createQuestion = function (id) {
  this.fragenid = id;
  this.titel = "default";
  this.tags = [];
  this.antworten = [];
  this.added = false;
};
//dont use directly, use addAnswer instead, makes sure answer has an id, no answer in question has
export const createAnswer = function (question) {
  this.text = "new answer";
  this.correct = false;
  this.id =
    question.antworten.length > 0
      ? Math.max(...question.antworten.map((a) => a.id)) + 1
      : 1;
};

//finds keys, which are in both objects
export function keysInBoth(obj1, obj2) {
  let obj1Keys = Object.keys(obj1);
  let obj2Keys = Object.keys(obj2);
  let keysInBoth = obj1Keys.reduce(
    (accumulator, qK) =>
      obj2Keys.includes(qK) ? [...accumulator, qK] : accumulator,
    []
  );
  return keysInBoth;
}

export function updateObjectKeysWithTypeChecking(objIn, updatingObj, type) {
  const newObj = updateObjectKeys(objIn, updatingObj);
  const check = keyTypesAreValid(newObj.obj, type);
  if (check.res) return newObj;
  else
    throw new Error(
      "cant update your object, updating object doesnt have right types for: " +
        check.failures
    );
}

//updates objectIn with all same keys of updatingObj
export function updateObjectKeys(objIn, updatingObj) {
  const keys = keysInBoth(objIn, updatingObj);
  let changes = 0;
  const obj = _.cloneDeep(objIn);
  if (!keys instanceof Array) {
    throw new Error("keys have to be an array");
  }
  keys.forEach((key) => {
    if (obj[key] !== updatingObj[key]) {
      if (!_.isEqual(obj[key], updatingObj[key])) {
        changes++;
        obj[key] = updatingObj[key];
      }
    }
  });
  return { obj: obj, changes: changes };
}

export function isInt(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) === value &&
    !isNaN(parseInt(value, 10))
  );
}

/*
module.exports = {
  questionFromObject: questionFromObject,
  createQuestion: createQuestion,
  keysInBoth: keysInBoth,
  isInt: isInt,
  updateObjectKeysWithTypeChecking: updateObjectKeysWithTypeChecking,
  addAnswer,
  updateAnswer,
  deleteAnswer,
  updateQuestion: updateQuestion,
  createAnswer: createAnswer,
  typesQuestion: typesQuestion,
  typesAnswer: typesAnswer,
  insertIfNotContained,
  removeIfContained,
};*/
