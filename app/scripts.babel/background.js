'use strict';

console.log('background.js here');

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // chrome.browserAction.setBadgeBackgroundColor({ color: [255, 255, 255, 0]});
  // chrome.browserAction.setBadgeText({text: count });
});

