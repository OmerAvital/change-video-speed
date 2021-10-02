'use strict';

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
      // Get array of all frames
      let frameIds = details.map((frameIdObject) => frameIdObject.frameId);

      chrome.scripting.executeScript({
        target: { tabId, frameIds },
        function: speedChanger,
      });
    });
  }
});

function speedChanger() {
  chrome.storage.sync.get(['speed'], ({ speed }) => {
    document.querySelectorAll('video').forEach(video => {
      // Remove event listeners EdPuzzle uses to stop skipping/speeding up video
      const stopListeners = e => e.stopImmediatePropagation();
      video.removeEventListener('ratechange', stopListeners, true);
      video.addEventListener('ratechange', stopListeners, true);

      video.playbackRate = speed;
    });
  });
}
