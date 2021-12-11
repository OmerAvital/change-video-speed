'use strict';

import './popup.scss';
import '../colors/colors.scss';
import '../colors/colorScheme';
import { speedChanger } from '../utils';

const speedInput = document.querySelector('.speed-input') as HTMLInputElement;
const settingsUrl = document.querySelector('.settings-url') as HTMLAnchorElement;
const numText = document.querySelector('.num') as HTMLHeadingElement;
const reset = document.getElementById('reset') as HTMLButtonElement;

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
  speedInput.min = '0.5';
  speedInput.max = '2';
}

reset.addEventListener('click', () => {
  speedInput.value = '1';
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

settingsUrl.href = `chrome-extension://${chrome.runtime.id}/options.html`;

function changeSpeed() {
  chrome.tabs.query({ active: true, currentWindow: true }, (currTab) => {
    const { id } = currTab[0];
    if (!id) return;

    chrome.webNavigation.getAllFrames({ tabId: id }, (frames) => {
      if (!frames) return;

      let frameIds = frames.map(({ frameId }) => frameId);

      chrome.scripting.executeScript({
        target: { tabId: id, frameIds: frameIds },
        func: speedChanger,
      });
    });
  });
}
