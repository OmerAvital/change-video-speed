"use strict";

const speedInput = document.getElementById("speedInput");
const numText = document.getElementById("num");
const reset = document.getElementById("reset");
const gear = document.getElementById("settings-gear");
const gearUrl = document.getElementById("settings-url");

chrome.storage.sync.get(["speed", "min", "max"], ({ speed, min, max }) => {
  speedInput.value = speed;
  numText.textContent = speedInput.value + "x";
  speedInput.min = min;
  speedInput.max = max;
});

reset.addEventListener("click", () => {
  speedInput.value = 1;
  numText.textContent = speedInput.value + "x";
  chrome.storage.sync.set({ speed: speedInput.value });
  changeSpeed(speedInput.value);
});

speedInput.addEventListener("input", () => {
  numText.textContent = speedInput.value + "x";
});

speedInput.addEventListener("mouseup", () => {
  chrome.storage.sync.set({ speed: speedInput.value });
  changeSpeed(speedInput.value);
});

// Settings icon
gear.addEventListener("mouseover", () => {
  gear.src = "assets/gear_filled.svg";
});

gear.addEventListener("mouseout", () => {
  gear.src = "assets/gear_empty.svg";
});

gearUrl.href = `chrome-extension://${chrome.runtime.id}/options.html`;

function changeSpeed(s) {
  chrome.tabs.query({ active: true, currentWindow: true }, (details) => {
    const tab = details[0];

    chrome.webNavigation.getAllFrames({ tabId: tab.id }, (details) => {
      // Get array of all iframes
      const frameIdsObjects = details;
      let frameIds = [];
      for (let i = 0; i < frameIdsObjects.length; i++) {
        frameIds.push(frameIdsObjects[i].frameId);
      }

      chrome.scripting.executeScript({
        target: { tabId: tab.id, frameIds: frameIds },
        function: changeFunction,
      });
    });
  });
}

function changeFunction() {
  chrome.storage.sync.get(["speed"], ({ speed }) => {
    try {
      Object.getOwnPropertyDescriptor(
        HTMLMediaElement.prototype,
        "playbackRate"
      ).set.call(document.querySelector("video"), speed);
    } catch {}
  });
}
