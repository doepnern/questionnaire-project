const _ = require("lodash");

function KeepHistory(oldHist) {
  if (oldHist != null) {
    this.history = _.cloneDeep(oldHist.history);
    this.currentPosition = oldHist.currentPosition;
  } else {
    this.history = [];
    // current position 0 means, at the end of the array
    this.currentPosition = 0;
  }
}

function reset() {
  return new KeepHistory();
}

//add to history, if currentPosition is at the end, just append. Otherwise split array and append according to current position
function addToHistory(o) {
  //make a copy of onject
  const obj = _.cloneDeep(o);
  console.log("adding to history:");
  console.log(this);
  console.log(obj);
  if (this.currentPosition == 0) {
    this.history.push(obj);
    return;
  }
  let hCopy = _.cloneDeep(this.history);
  let newHistory = hCopy.slice(0, this.getCurrentIndex() + 1);
  newHistory.push(obj);
  this.history = newHistory;
  this.currentPosition = 0;
  console.log("after adding:");
  console.log(this);
}

//returns index of current position
function getCurrentIndex() {
  return this.history.length + this.currentPosition - 1;
}

//travels numSteps in given direction, by default 1 step bac
function travel(numSteps = -1) {
  console.log("traveling from history");
  console.log(this.history);
  let destination = this.getCurrentIndex() + numSteps;
  if (destination >= this.history.length || destination < 0) {
    console.log(
      "cant go to this point in time, destination index: " +
        destination +
        " not recorded"
    );
    return undefined;
  }
  //update current position to time traveled offset, so you can go back forward
  this.currentPosition += numSteps;
  console.log("going back to:");
  console.log(this.history[destination]);
  return _.cloneDeep(this.history[destination]);
}

function canTravelForward() {
  return this.currentPosition < 0;
}

function canTravelBackward() {
  return this.getCurrentIndex() > 0;
}

//add functions to keepHistory
KeepHistory.prototype.travel = travel;
KeepHistory.prototype.addToHistory = addToHistory;
KeepHistory.prototype.init = reset;
KeepHistory.prototype.getCurrentIndex = getCurrentIndex;
KeepHistory.prototype.canTravelBackward = canTravelBackward;
KeepHistory.prototype.canTravelForward = canTravelForward;
KeepHistory.prototype.travelBack = function () {
  return this.travel(-1);
};

module.exports = {
  KeepHistory: KeepHistory,
};
