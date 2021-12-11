'use strict';

let currentColorScheme: string;
let preferredColorScheme = window.matchMedia('(prefers-color-scheme: dark)')
                             .matches
                           ? 'dark'
                           : 'light';

try {
  chrome.storage.sync.get(['colorScheme'], ({ colorScheme }) => {
    if (colorScheme === undefined) {
      throw new Error('Color scheme not saved.');
    }

    currentColorScheme = colorScheme;
    setColorScheme(currentColorScheme);
  });
} catch (e) {
  // setColorScheme("auto");
  setColorScheme('dark');
  chrome.storage.sync.set({ colorScheme: 'auto' });
}

window
  .matchMedia('(prefers-color-scheme: dark)')
  .addEventListener('change', (e) => {
    if (currentColorScheme === 'auto') {
      preferredColorScheme = e.matches ? 'dark' : 'light';
      setColorScheme('auto');
    }
  });

// Add color transition after page 100ms to avoid flash of white
setTimeout(() => {
  const style = document.createElement('style');
  style.innerHTML = `
    *,
    *::before,
    *::after {
      transition: color 0.3s ease,
      background-color 0.3s ease,
      border-color 0.3s ease;
    }
`;
  document.head.appendChild(style);
}, 100);

export function setColorScheme(scheme: string) {
  const colorScheme = scheme === 'auto' ? preferredColorScheme : scheme;
  document.documentElement.setAttribute('data-color-scheme', colorScheme);

  currentColorScheme = scheme;
  chrome.storage.sync.set({ colorScheme: scheme });
}
