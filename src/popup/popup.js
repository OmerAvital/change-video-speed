'use strict';

const speedInput = document.querySelector('.speed-input');
const settingsUrl = document.querySelector('.settings-url');
const numText = document.querySelector('.num');
const reset = document.getElementById('reset');

const setLabelText = () => {
  numText.textContent = `${speedInput.value}x`;
};

try {
  chrome.storage.sync.get(['speed', 'min', 'max'], ({ speed, min, max }) => {
    speedInput.value = speed;
    setLabelText();
    speedInput.min = min;
    speedInput.max = max;
  });
} catch {
  speedInput.min = 0.5;
  speedInput.max = 2;
}

reset.addEventListener('click', () => {
  speedInput.value = 1;
  setLabelText();
  chrome.storage.sync.set({ speed: speedInput.value });
  changeSpeed();
});

speedInput.addEventListener('input', () => {
  setLabelText();
});

speedInput.addEventListener('mouseup', () => {
  chrome.storage.sync.set({ speed: speedInput.value });
  changeSpeed();
});

settingsUrl.href = `chrome-extension://${chrome.runtime.id}/src/options/options.html`;

function changeSpeed() {
  chrome.tabs.query({ active: true, currentWindow: true }, (currTab) => {
    const tab = currTab[0];

    chrome.webNavigation.getAllFrames({ tabId: tab.id }, (frames) => {
      let frameIds = frames.map(({ frameId }) => frameId);

      chrome.scripting.executeScript({
        target: { tabId: tab.id, frameIds: frameIds },
        function: speedChanger,
      });
    });
  });
}

function speedChanger() {
  chrome.storage.sync.get(['speed'], ({ speed }) => {
    document.querySelectorAll('video').forEach(video => {
      video.addEventListener('ratechange', (e) => {
        e.stopImmediatePropagation();
      }, true);
      video.playbackRate = speed;
    });
  });
}
