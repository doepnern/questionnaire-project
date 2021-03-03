const { isArguments } = require("lodash");
const qs = require("./QuestionStorage");

describe("question Interface test", () => {
  it("question storage creation", () => {
    const myQs = new qs.QuestionStorage();
    expect(myQs.getQuestions()).toEqual([]);
  });
  it("adding a question", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({ fragenid: 1, titel: "me and my friends" });
    expect(myQs.getQuestions()).toEqual([
      {
        fragenid: 1,
        titel: "me and my friends",
        antworten: [],
        tags: [],
      },
    ]);
  });
  it("removes additional information", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({
      fragenid: 2,
      antworten: [{ text: "nice", nom: "nom", correct: true }],
    });
    expect(myQs.getQuestions()).toEqual([
      {
        fragenid: 2,
        titel: "default",
        antworten: [{ text: "nice", correct: true }],
        tags: [],
      },
    ]);
  });
  it("recognizes wrong format", () => {
    const myQs = new qs.QuestionStorage();
    expect(() =>
      myQs.addQuestion({
        fragenid: 2,
        antworten: [{ text: "nice", nom: "nom", correct: "hi" }],
      })
    ).toThrow();
    expect(() =>
      myQs.addQuestion({
        fragenid: "sad",
        antworten: [{ text: "nice", nom: "nom", correct: true }],
      })
    ).toThrow();
    expect(() =>
      myQs.addQuestion({
        fragenid: 2,
        antworten: [{ text: "nice", nom: "nom", correct: true }],
        tags: [1, 23, "hi"],
      })
    ).toThrow();
  });
  it("add answer interface", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({
      fragenid: 7,
      antworten: [{ text: "nice", correct: true }],
    });
    myQs.updateQuestion(7, qs.addAnswer());
    expect(myQs.getQuestions()[0].antworten.length).toBe(2);
  });
  it("remove answer interface", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({
      fragenid: 7,
      antworten: [{ text: "nice", correct: true }],
    });
    myQs.updateQuestion(7, qs.removeAnswer(0));
    expect(myQs.getQuestions()[0].antworten.length).toBe(0);
  });
  it("update answer interface", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({
      fragenid: 7,
      antworten: [
        { text: "nice", correct: true },
        { text: "old", correct: true },
      ],
    });
    myQs.updateQuestion(
      7,
      qs.updateAnswer(1, { text: "updated", correct: false, hi: "ho" })
    );
    expect(myQs.getQuestions()[0].antworten).toEqual([
      { text: "nice", correct: true },
      { text: "updated", correct: false },
    ]);
  });
  it("hstory travel back", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({
      fragenid: 7,
      antworten: [
        { text: "nice", correct: true },
        { text: "old", correct: true },
      ],
    });
    myQs.updateQuestion(
      7,
      qs.updateAnswer(1, { text: "updated", correct: false, hi: "ho" })
    );
    myQs.travelBack();
    expect(myQs.getQuestions()[0].antworten[1]).toEqual({
      text: "old",
      correct: true,
    });
  });
  it("hstory travel back and forward", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({
      fragenid: 7,
      antworten: [
        { text: "nice", correct: true },
        { text: "old", correct: true },
      ],
    });
    myQs.updateQuestion(
      7,
      qs.updateAnswer(1, { text: "updated", correct: false, hi: "ho" })
    );
    myQs.travelBack();
    expect(myQs.getQuestions()[0].antworten[1]).toEqual({
      text: "old",
      correct: true,
    });
    myQs.travelForward();
    expect(myQs.getQuestions()[0].antworten[1]).toEqual({
      text: "updated",
      correct: false,
    });
  });
  it("not adding to history when answer doesnt change", () => {
    const myQs = new qs.QuestionStorage();
    myQs.addQuestion({
      fragenid: 7,
      antworten: [
        { text: "nice", correct: true },
        { text: "old", correct: true },
      ],
    });
    myQs.updateQuestion(
      7,
      qs.updateAnswer(1, { text: "old", correct: true, hi: "ho" })
    );
    expect(() => myQs.travelBack()).toThrow(
      "cant go back to this point in time"
    );
  });
});
