"use strict";

const page = document.querySelector(".page");
const minimum = document.getElementById("min");
const maximum = document.getElementById("max");
const save = document.getElementById("save");
const reset = document.getElementById("reset");
const modal = document.getElementById("modal-container");

const defaultValues = {
  min: 0.5,
  max: 3,
};

try {
  chrome.storage.sync.get(["min", "max"], ({ min, max }) => {
    minimum.value = min;
    maximum.value = max;
  });
} catch {
  minimum.value = defaultValues.min;
  maximum.value = defaultValues.max;
}

function handleInputBlur() {
  this.value = this.value || defaultValues[this.id];
}

minimum.addEventListener("blur", handleInputBlur);
maximum.addEventListener("blur", handleInputBlur);

save.addEventListener("click", () => {
  showModel();

  chrome.storage.sync.set({ min: minimum.value, max: maximum.value });
  chrome.storage.sync.get(["speed"], ({ speed }) => {
    if (speed < minimum.value) {
      chrome.storage.sync.set({ speed: minimum.value });
      return;
    }
    if (speed > maximum.value) {
      chrome.storage.sync.set({ speed: maximum.value });
    }
  });
});

reset.addEventListener("click", () => {
  minimum.value = defaultValues.min;
  maximum.value = defaultValues.max;

  showModel();

  chrome.storage.sync.set({
    speed: 1,
    min: defaultValues.min,
    max: defaultValues.max,
  });
});

function showModel() {
  modal.classList.remove("hidden");

  setTimeout(() => {
    modal.classList.remove("visually-hidden");
    page.classList.add("blur");
  }, 20);
}
