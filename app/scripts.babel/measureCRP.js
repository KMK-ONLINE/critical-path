'use strict';

console.log('measureCRP.js here');

const reloadCountKey = 'reloadCount',
      interactiveKey = 'interactive',
      dclKey = 'dcl',
      completeKey = 'complete';


function getItem(key) {
  let value = localStorage.getItem(key);

  if(value && value != NaN) {
    return parseInt(value);
  } else {
    return 0;
  }
}

function setItem(key, value) {
  localStorage.setItem(key, value);
}


class MeasureCRP {

  constructor() {
    let reloadCount = getItem(reloadCountKey);
    // if(reloadCount == null) { return; }

    if(reloadCount >= 10) {
      return;
    } else {
      let newReloadCount = reloadCount + 1;
      setItem(reloadCountKey, newReloadCount);
      chrome.extension.sendRequest(newReloadCount);
    }

    switch (document.readyState) {
      case "loading":
        // The document is still loading.
        window.onload = this.recordCRP;
        break;

      case "interactive":
        // The document has finished loading. We can now access the DOM elements.
        window.onload = this.recordCRP;
        break;

      case "complete":
        // The page is fully loaded.
        this.recordCRP();
        break;
    }
  }

  recordCRP() {
    let results = this.measureCRP();
    console.debug("recordCRP: ", results);

    for(let key in results) {
      let currentValue = results[key];
      let previousValue = getItem(key);
      setItem(key, currentValue + previousValue);
    }

    window.location = window.location;
  }

  measureCRP() {
    var t = window.performance.timing,
      interactive = t.domInteractive - t.domLoading,
      dcl =         t.domContentLoadedEventStart - t.domLoading,
      complete =    t.domComplete - t.domLoading;

    var result = {};
    result[interactiveKey]  = interactive;
    result[dclKey]          = dcl;
    result[completeKey]     = complete;
    return result;

  }

  static getAverageCRP() {
    let count = getItem(reloadCountKey);

    let averageInteractive = Math.round(getItem(interactiveKey) / count),
        averageDcl = Math.round(getItem(dclKey) / count),
        averageComplete = Math.round(getItem(completeKey) / count);

    var result = {};
    result[interactiveKey]  = averageInteractive;
    result[dclKey]          = averageDcl;
    result[completeKey]     = averageComplete;
    return result;

    // return averageInteractive + "\t" + averageDcl + "\t" + averageComplete;
  }

  static clearAll() {
    localStorage.removeItem(reloadCountKey);
    localStorage.removeItem(interactiveKey);
    localStorage.removeItem(dclKey);
    localStorage.removeItem(completeKey);
  }

}

new MeasureCRP();

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.method == "getAverageCRP") {
    var stats = MeasureCRP.getAverageCRP();
    sendResponse(stats);
    MeasureCRP.clearAll();
  }
});

