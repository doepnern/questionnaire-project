function useDebouncer(func, wait) {
  var timeoutId = null;
  return function () {
    var context = this,
      args = arguments;
    var later = function () {
      //reset timeoutId when successfully called
      timeoutId = null;
      //execute function with its given parameters
      func.apply(context, args);
    };
    //if no function is scheduled, schedule execution
    if (timeoutId === null) {
      timeoutId = setTimeout(later, wait);
    }
    //if function is scheduled, clear timeout and reschedule
    else {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(later, wait);
    }
  };
}
module.exports = {
  myDebouncer: useDebouncer,
};
