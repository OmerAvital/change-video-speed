import { setSpeed } from './storage';

function speedChanger(speed: number) {
  document.querySelectorAll('video').forEach(video => {
    // Remove event listeners EdPuzzle uses to stop skipping/speeding up video
    const stopListeners = (e: Event) => e.stopImmediatePropagation();
    video.removeEventListener('ratechange', stopListeners, true);
    video.addEventListener('ratechange', stopListeners, true);

    // eslint-disable-next-line no-param-reassign
    video.playbackRate = speed;
  });
}

export default function changeSpeed(tabId: number, speed: number) {
  setSpeed(tabId, speed);

  if (!chrome?.webNavigation?.getAllFrames) return;

  chrome.webNavigation.getAllFrames({ tabId }, frames => {
    if (!frames) return;

    const frameIds = frames.map(({ frameId }) => frameId);
    chrome.scripting.executeScript({
      target: { tabId, frameIds },
      func: speedChanger,
      args: [speed],
    });
  });
}
