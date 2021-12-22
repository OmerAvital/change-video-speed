import { removeSpeed } from '../../storage';

async function getTabId() {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  return (tabs.length > 0) ? tabs[0].id : null;
}

// event to run execute.ts content when extension's button is clicked
async function execScript() {
  const tabId = await getTabId();
  if (!tabId) return;

  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['execute.ts'],
  });
}

chrome.action.onClicked.addListener(execScript);

chrome.tabs.onRemoved.addListener(tabId => {
  removeSpeed(tabId);
});
