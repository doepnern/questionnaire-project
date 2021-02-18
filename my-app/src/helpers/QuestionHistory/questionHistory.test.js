const qh = require("./questionHistory.js");

test("successfully adds object to history and is able to travel back", () => {
  let myH = new qh.KeepHistory();
  myH.addToHistory({ t: 1, s: "first" });
  myH.addToHistory({ t: 2, s: "second" });
  myH.addToHistory({ t: 3, s: "third" });
  myH.addToHistory({ t: 4 });

  expect(myH.travel(-1)).toStrictEqual({ t: 3, s: "third" });
  expect(myH.travel(-4)).toBe(undefined);
  expect(myH.travel(-1)).toStrictEqual({ t: 2, s: "second" });
  expect(myH.currentPosition).toBe(-2);
});

test("when after traveling back, new objects are added, the current Position gets reset and the array gets updated accordingly", () => {
  let myH = new qh.KeepHistory();
  myH.addToHistory({ t: 1, s: "first" });
  myH.addToHistory({ t: 2, s: "second" });
  myH.addToHistory({ t: 3, s: "third" });
  myH.addToHistory({ t: 4 });

  expect(myH.canTravelForward()).toBe(false);
  expect(myH.travel(-1)).toStrictEqual({ t: 3, s: "third" });
  expect(myH.canTravelBackward()).toBe(true);
  expect(myH.canTravelForward()).toBe(true);
  expect(myH.travel(-3)).toBe(undefined);
  expect(myH.travel(-1)).toStrictEqual({ t: 2, s: "second" });
  expect(myH.canTravelBackward()).toBe(true);
  expect(myH.canTravelForward()).toBe(true);
  expect(myH.currentPosition).toBe(-2);
  myH.addToHistory({ t: 3, s: "should now be third" });
  expect(myH.canTravelForward()).toBe(false);
  expect(myH.history).toStrictEqual([
    { t: 1, s: "first" },
    { t: 2, s: "second" },
    { t: 3, s: "should now be third" },
  ]);
  expect(myH.travel(0)).toStrictEqual({ t: 3, s: "should now be third" });
  expect(myH.travel(1)).toBe(undefined);
  expect(myH.travel(-2)).toStrictEqual({ t: 1, s: "first" });
  expect(myH.currentPosition).toBe(-2);
  expect(myH.canTravelBackward()).toBe(false);
  expect(myH.canTravelForward()).toBe(true);
});

test("can use travelBack multiple times to travers array backwards", () => {
  let myH = new qh.KeepHistory();
  myH.addToHistory({ t: 1, s: "first" });
  myH.addToHistory({ t: 2, s: "second" });
  myH.addToHistory({ t: 3, s: "third" });
  myH.addToHistory({ t: 4, s: "fourth" });

  expect(myH.travelBack()).toStrictEqual({ t: 3, s: "third" });
  myH.addToHistory({ t: "newEnd" });
  expect(myH.travelBack()).toStrictEqual({ t: 3, s: "third" });
  expect(myH.travelBack()).toStrictEqual({ t: 2, s: "second" });
  expect(myH.travelBack()).toStrictEqual({ t: 1, s: "first" });
});
