'use strict';

console.log('popup.js here');

// chrome.tabs.getSelected(null, function(tab) {
//   // chrome.tabs.executeScript(tab.id, { code: code });
// });
//

chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, { method: "getAverageCRP" }, function(response) {
    if(!response.interactive && !response.dcl && !response.complete) return;

    var el = document.getElementById('interactive');
    el.innerText = response.interactive;

    var el = document.getElementById('dcl');
    el.innerText = response.dcl;

    var el = document.getElementById('complete');
    el.innerText = response.complete;
  });
});

