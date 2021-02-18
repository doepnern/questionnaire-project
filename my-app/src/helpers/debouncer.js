function useDebouncer(func, wait) {
  console.log("use Debouncer called");
  var timeoutId = null;
  return function () {
    console.log("inner debouncer called, timeoutId is " + timeoutId);
    var context = this,
      args = arguments;
    var later = function () {
      console.log("later function called");
      //reset timeoutId when successfully called
      timeoutId = null;
      //execute function with its given parameters
      func.apply(context, args);
    };
    //if no function is scheduled, schedule execution
    if (timeoutId === null) {
      console.log("no funciton currently scheduled, scheduling in " + wait);
      timeoutId = setTimeout(later, wait);
    }
    //if function is scheduled, clear timeout and reschedule
    else {
      console.log("rescheduling in " + wait);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(later, wait);
    }
  };
}
module.exports = {
  myDebouncer: useDebouncer,
};
