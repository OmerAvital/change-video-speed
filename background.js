"use strict";

chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ speed: 1, min: 0.5, max: 2, colorScheme: "auto" });
});
