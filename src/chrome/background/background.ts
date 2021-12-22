import { removeSpeed } from '../../storage';

chrome.tabs.onRemoved.addListener(tabId => {
  removeSpeed(tabId);
});
