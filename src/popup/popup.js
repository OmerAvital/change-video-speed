"use strict";

const speedInput = document.querySelector(".speed-input");
const gear = document.querySelector(".settings-gear");
const settingsUrl = document.querySelector(".settings-url");
const numText = document.querySelector(".num");
const reset = document.getElementById("reset");

const setLabelText = () => {
  numText.textContent = `${speedInput.value}x`;
};

try {
  chrome.storage.sync.get(["speed", "min", "max"], ({ speed, min, max }) => {
    speedInput.value = speed;
    setLabelText();
    speedInput.min = min;
    speedInput.max = max;
  });
} catch {
  speedInput.min = 0.5;
  speedInput.max = 2;
}

reset.addEventListener("click", () => {
  speedInput.value = 1;
  setLabelText();
  chrome.storage.sync.set({ speed: speedInput.value });
  changeSpeed(speedInput.value);
});

speedInput.addEventListener("input", () => {
  setLabelText();
});

speedInput.addEventListener("mouseup", () => {
  chrome.storage.sync.set({ speed: speedInput.value });
  changeSpeed(speedInput.value);
});

// Settings icon
gear.addEventListener("mouseover", () => {
  gear.src = "../../assets/gear_filled.svg";
});

gear.addEventListener("mouseout", () => {
  gear.src = "../../assets/gear_empty.svg";
});

settingsUrl.href = `chrome-extension://${chrome.runtime.id}/src/options/options.html`;

function changeSpeed() {
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
