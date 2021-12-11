export function speedChanger() {
  chrome.storage.sync.get(['speed'], ({ speed }) => {
    document.querySelectorAll('video').forEach(video => {
      // Remove event listeners EdPuzzle uses to stop skipping/speeding up video
      const stopListeners = (e: Event) => e.stopImmediatePropagation();
      video.removeEventListener('ratechange', stopListeners, true);
      video.addEventListener('ratechange', stopListeners, true);

      video.playbackRate = speed;
    });
  });
}
