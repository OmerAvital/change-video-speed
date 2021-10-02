'use strict';

const minimum = document.getElementById('min');
const maximum = document.getElementById('max');
const colorSchemeOptions = document.querySelectorAll('.color-scheme-option');
const save = document.getElementById('save');
const reset = document.getElementById('reset');
const saveSpeedCheckbox = document.getElementById('save-speed');

const page = document.querySelector('.page');
const modal = document.querySelector('.modal-container');

const defaultValues = {
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
  minimum.value = defaultValues.min;
  maximum.value = defaultValues.max;
  saveSpeedCheckbox.checked = defaultValues.saveSpeed;
}

function handleInputBlur() {
  this.value = this.value || defaultValues[this.id];
  if (this.id === 'min' && parseFloat(this.value) >= 1) {
    this.value = 0.9;
  }
  if (this.id === 'max' && parseFloat(this.value) <= 1) {
    this.value = 1.1;
  }

  chrome.storage.sync.set({ [this.id]: this.value });
}

minimum.addEventListener('blur', handleInputBlur);
maximum.addEventListener('blur', handleInputBlur);

colorSchemeOptions.forEach((colorSchemeOption) =>
  colorSchemeOption.addEventListener('change', (e) =>
    setColorScheme(e.target.value),
  ),
);

saveSpeedCheckbox.addEventListener('change', (e) => {
  chrome.storage.sync.set({ saveSpeed: e.target.checked });
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
