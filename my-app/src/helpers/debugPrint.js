export function debugCall(func) {
  let timesCalled = 0;
  console.log("function: " + func.name + " reinitialized");

  return function () {
    timesCalled++;
    console.log(
      "function: " +
        func.name +
        ", since definiton called " +
        timesCalled +
        " times with arguments: "
    );
    console.log(arguments);
    func.apply(undefined, arguments);
  };
}
