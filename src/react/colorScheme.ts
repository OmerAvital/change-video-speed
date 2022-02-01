import { ColorScheme, getStoredOptions } from 'chrome/storage';

export const schemes: ColorScheme[] = ['auto', 'light', 'dark'];

export function updateScheme(scheme: ColorScheme) {
  let colorScheme = scheme;
  if (colorScheme === 'auto') {
    colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  document.body.classList.remove('light', 'dark');
  document.body.classList.add(colorScheme);
}

export function watchScheme() {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', e => {
      void getStoredOptions().then(({ colorScheme }) => {
        if (colorScheme === 'auto') {
          updateScheme(e.matches ? 'dark' : 'light');
        }
      });
    });
}
