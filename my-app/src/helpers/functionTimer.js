function useFunctionTimer(func) {
  var timedFunction = function () {
    let start = window.performance.now();
    func.apply(this, arguments);
    let end = window.performance.now();
    let passed = end - start;
    console.log(
      "your function needed " + passed.toFixed(6) + " milliseconds to execute"
    );
  };
  return timedFunction;
}

module.exports = {
  myFunctionTimer: useFunctionTimer,
};
