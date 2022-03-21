function speedChanger(speed: number) {
  const stopListeners = (e: Event) => e.stopImmediatePropagation();

  function removeListeners<K extends keyof DocumentEventMap>(
    element: HTMLElement | Document,
    type: K[],
  ) {
    type.forEach(t => {
      element.removeEventListener(t, stopListeners, true);
      element.addEventListener(t, stopListeners, true);
    });
  }

  if (document.URL.includes('edpuzzle.com')) {
    removeListeners(document, ['visibilitychange']);
  }

  document.querySelectorAll('video')
    .forEach(video => {
      if (document.URL.includes('edpuzzle.com')) {
        removeListeners(video, ['ratechange']);
      }
      video.playbackRate = speed;
    });
}

export default function changeSpeed(tabId: number, speed: number) {
  void chrome.scripting.executeScript({
    target: {
      tabId,
      allFrames: true,
    },
    args: [speed],
    func: speedChanger,
  });
}
