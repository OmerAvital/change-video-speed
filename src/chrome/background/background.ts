import { getStoredOptions, removeSpeed, saveOptionsToStorage } from 'chrome/storage';
import changeSpeed from 'chrome/changeSpeed';

chrome.tabs.onRemoved.addListener(tabId => {
  void removeSpeed(tabId).then();
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status !== 'complete') return;
  void getStoredOptions().then(options => {
    const speed = options.speed[tabId];
    if (speed === undefined) return;
    void changeSpeed(tabId, speed);
  });
});

chrome.runtime.onStartup.addListener(() => {
  // clean up old tabs that have been removed
  void saveOptionsToStorage({ speed: {} });
});
