'use strict';

import './options.scss';
import '../colors/colors.scss';
import '../colors/colorScheme';
import { setColorScheme } from '../colors/colorScheme';

const minimum = document.getElementById('min') as HTMLInputElement;
const maximum = document.getElementById('max') as HTMLInputElement;
const colorSchemeOptions = document.querySelectorAll('.color-scheme-option') as NodeListOf<HTMLInputElement>;
const save = document.getElementById('save') as HTMLButtonElement;
const reset = document.getElementById('reset') as HTMLButtonElement;
const saveSpeedCheckbox = document.getElementById('save-speed') as HTMLInputElement;

const page = document.querySelector('.page') as HTMLDivElement;
const modal = document.querySelector('.modal-container') as HTMLDivElement;

type Values = 'speed' | 'min' | 'max' | 'colorScheme' | 'saveSpeed';

const defaultValues: Record<Values, any> = {
  speed: 1,
  min: 0.5,
  max: 2,
  colorScheme: 'auto',
  saveSpeed: true,
};

try {
  chrome.storage.sync.get(
    ['min', 'max', 'colorScheme', 'saveSpeed'],
    ({ min, max, colorScheme, saveSpeed }) => {
      minimum.value = min;
      maximum.value = max;
      saveSpeedCheckbox.checked = saveSpeed;
      colorSchemeOptions.forEach((element) => {
        if (element.value === colorScheme) {
          element.checked = true;
        }
      });
    },
  );
} catch {
  minimum.value = defaultValues.min.toString();
  maximum.value = defaultValues.max.toString();
  saveSpeedCheckbox.checked = defaultValues.saveSpeed;
}

function handleInputBlur(this: HTMLInputElement) {
  if (!Object.keys(defaultValues).includes(this.id)) return;
  const id: Values = this.id as Values;

  this.value = this.value || defaultValues[id];
  if (this.id === 'min' && parseFloat(this.value) >= 1) {
    this.value = '0.9';
  }
  if (this.id === 'max' && parseFloat(this.value) <= 1) {
    this.value = '1.1';
  }

  chrome.storage.sync.set({ [this.id]: this.value });
}

minimum.addEventListener('blur', handleInputBlur);
maximum.addEventListener('blur', handleInputBlur);

colorSchemeOptions.forEach(colorSchemeOption =>
  colorSchemeOption.addEventListener('change', function () {
    setColorScheme(this.value);
  }),
);

saveSpeedCheckbox.addEventListener('change', function () {
  chrome.storage.sync.set({ saveSpeed: this.checked });
});

save.addEventListener('click', () => {
  showModel();
});

reset.addEventListener('click', () => {
  showModel();
  minimum.value = defaultValues.min;
  maximum.value = defaultValues.max;
  saveSpeedCheckbox.checked = defaultValues.saveSpeed;
  chrome.storage.sync.set(defaultValues);
});

function showModel() {
  modal.classList.remove('hidden');

  setTimeout(() => {
    modal.classList.remove('visually-hidden');
    page.classList.add('blur');
  }, 20);
}
