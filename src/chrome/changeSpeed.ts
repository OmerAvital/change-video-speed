function speedChanger(speed: number) {
  const stopListeners = (e: Event) => e.stopImmediatePropagation();

  function removeListeners<K extends keyof DocumentEventMap>(element: HTMLElement, type: K[]) {
    type.forEach(t => {
      element.removeEventListener(t, stopListeners, true);
      element.addEventListener(t, stopListeners, true);
    });
  }

  document.querySelectorAll('video')
    .forEach(video => {
      removeListeners(video, ['ratechange']);
      video.playbackRate = speed;
    });
}

export default function changeSpeed(tabId: number, speed: number) {
  if (!chrome?.webNavigation?.getAllFrames) {
    throw new Error('chrome.webNavigation.getAllFrames is not available');
  }

  chrome.webNavigation.getAllFrames({ tabId }, frames => {
    if (!frames) return;

    const frameIds = frames.map(({ frameId }) => frameId);
    void chrome.scripting.executeScript({
      target: {
        tabId,
        frameIds,
      },
      func: speedChanger,
      args: [speed],
    });
  });
}
