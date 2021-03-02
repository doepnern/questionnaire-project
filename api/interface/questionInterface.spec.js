const qi = require("./questionInterface");
describe("question Interface test", () => {
  it("is int test", () => {
    expect(qi.isInt(2)).toBe(true);
    expect(qi.isInt("2")).toBe(true);
    expect(qi.isInt("two")).toBe(false);
  });
  it("getting same keys in object", () => {
    let obj1 = {
      fragenid: "hi",
      titel: "top titel",
      tags: ["hi", "jo"],
    };
    let objQ = new qi.createQuestion(1);
    expect(qi.keysInBoth(obj1, objQ)).toEqual(["fragenid", "titel", "tags"]);
    expect(qi.keysInBoth({ tim: "23" }, { tom: "23" })).toEqual([]);
    expect(
      qi.keysInBoth({ f: "23", o: 1, b: 3 }, { f: "23", o: 1, b: 3 })
    ).toEqual(["f", "o", "b"]);
  });
  it("creates question from object correct", () => {
    let obj1 = {
      fragenid: "hi",
      titel: "top titel",
      tags: ["hi", "jo"],
    };
    expect(() => qi.questionFromObject(obj1)).toThrow(
      "not a valid fragenid, make sure object for questionFromObject has key: fragenid with valid Integer value"
    );
    expect(
      qi.questionFromObject({ fragenid: 10, titel: "", tags: ["foo", "bar"] })
        .obj
    ).toEqual({
      fragenid: 10,
      titel: "",
      tags: ["foo", "bar"],
      antworten: [],
    });
  });
  it("format testting", () => {
    expect(() =>
      qi.questionFromObject({ fragenid: 10, titel: "", tags: "tomomomom" })
    ).toThrow(
      "cant update your object, updating object doesnt have right types for: tags, value: tomomomom"
    );
    expect(
      qi.questionFromObject({ fragenid: 10, tags: ["tim", "tam"] }).obj
    ).toEqual({
      fragenid: 10,
      titel: "default",
      tags: ["tim", "tam"],
      antworten: [],
    });
    expect(() =>
      qi.questionFromObject({
        fragenid: 10,
        titel: "",
        antworten: "kll",
        tags: 12,
      })
    ).toThrow(
      "cant update your object, updating object doesnt have right types for: tags, value: 12,antworten"
    );
    expect(() =>
      qi.questionFromObject({
        fragenid: 10,
        antworten: ["hi", "ho"],
      })
    ).toThrow(
      "cant update your object, updating object doesnt have right types for: antworten, value: hi,ho"
    );
    expect(() =>
      qi.questionFromObject({
        fragenid: 10,
        antworten: [{}],
      })
    ).toThrow(
      "cant update your object, updating object doesnt have right types for: antworten, value: "
    );
    expect(() =>
      qi.questionFromObject({
        fragenid: 10,
        antworten: [
          { text: "test", correct: true },
          { text: "wew", correct: 9 },
        ],
      })
    ).toThrow(
      "cant update your object, updating object doesnt have right types for: antworten"
    );
    expect(
      qi.questionFromObject({
        fragenid: 10,
        antworten: [
          { text: "tim", correct: true },
          { text: "tim", correct: false },
        ],
      }).obj
    ).toEqual({
      fragenid: 10,
      titel: "default",
      tags: [],
      antworten: [
        { text: "tim", correct: true },
        { text: "tim", correct: false },
      ],
    });
  });
  it("counts updates correctly", () => {
    let obj1 = {
      fragenid: "10",
      titel: "top titel",
      tags: ["hi", "jo"],
    };
    let q1 = qi.questionFromObject(obj1);
    expect(q1.obj).toEqual({
      fragenid: 10,
      titel: "top titel",
      tags: ["hi", "jo"],
      antworten: [],
    });
    expect(q1.changes).toEqual(2);
    let q2 = qi.updateObjectKeysWithTypeChecking(
      q1.obj,
      { tags: ["hi", "jo"] },
      qi.typesQuestion
    );
    expect(q2.changes).toBe(0);
    let q3 = qi.updateObjectKeysWithTypeChecking(
      q1.obj,
      { tags: ["hi", "ja"] },
      qi.typesQuestion
    );
    expect(q3.changes).toBe(1);
    expect(q3.obj).toEqual({
      fragenid: 10,
      titel: "top titel",
      tags: ["hi", "ja"],
      antworten: [],
    });
  });
  it("answer editing functions", () => {
    let obj1 = {
      fragenid: 10,
      titel: "top titel",
      tags: ["hi", "jo"],
    };
    let q1 = qi.questionFromObject(obj1).obj;
    console.log(q1);
    let q2 = qi.addAnswer(q1).obj;
    expect(q2).toEqual({
      ...obj1,
      antworten: [{ text: "new answer", correct: false }],
    });
    let q3 = qi.updateAnswer(q2, 0, { text: "changed" });
    expect(q3.obj).toEqual({
      ...obj1,
      antworten: [{ text: "changed", correct: false }],
    });
    expect(q3.changes).toBe(1);
    let q4 = qi.updateAnswer(q3.obj, 0, { text: "changed" });
    expect(q4.obj).toEqual({
      ...obj1,
      antworten: [{ text: "changed", correct: false }],
    });
    expect(q3.obj).toEqual({
      ...obj1,
      antworten: [{ text: "changed", correct: false }],
    });
    expect(q4.changes).toBe(0);
    expect(() => qi.updateAnswer(q4.obj, 0, { text: 12 })).toThrow();
    //wont take keys not in an antwort
    expect(qi.updateAnswer(q4.obj, 0, { titel: "12" }).obj).toEqual({
      ...obj1,
      antworten: [{ text: "changed", correct: false }],
    });
    expect(qi.deleteAnswer(qi.addAnswer(q4.obj).obj, 0).obj).toEqual({
      ...obj1,
      antworten: [{ text: "new answer", correct: false }],
    });
  });
});
