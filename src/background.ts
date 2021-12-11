'use strict';

import { speedChanger } from './utils';

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    speed: 1,
    min: 0.5,
    max: 2,
    colorScheme: 'auto',
    saveSpeed: true,
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (!tab.url) {
    return;
  }

  if (changeInfo.status === 'complete' && tab.active) {
    chrome.webNavigation.getAllFrames({ tabId }, (details) => {
      if (!details) return;
      // Get array of all frames
      let frameIds = details.map((frameIdObject) => frameIdObject.frameId);

      chrome.scripting.executeScript({
        target: { tabId, frameIds },
        func: speedChanger,
      });
    });
  }
});
