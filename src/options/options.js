"use strict";

const minimum = document.getElementById("min");
const maximum = document.getElementById("max");
const colorSchemeOptions = document.querySelectorAll(".color-scheme-option");
const save = document.getElementById("save");
const reset = document.getElementById("reset");

const page = document.querySelector(".page");
const modal = document.getElementById("modal-container");

const defaultValues = {
  speed: 1,
  min: 0.5,
  max: 2,
  colorScheme: "auto",
};

try {
  chrome.storage.sync.get(
    ["min", "max", "colorScheme"],
    ({ min, max, colorScheme }) => {
      minimum.value = min;
      maximum.value = max;
      colorSchemeOptions.forEach((element) => {
        if (element.value === colorScheme) {
          element.checked = true;
        }
      });
    }
  );
} catch {
  minimum.value = defaultValues.min;
  maximum.value = defaultValues.max;
}

function handleInputBlur() {
  this.value = this.value || defaultValues[this.id];
  if (this.id === "min" && parseFloat(this.value) >= 1) {
    this.value = 0.9;
  }
  if (this.id === "max" && parseFloat(this.value) <= 1) {
    this.value = 1.1;
  }

  chrome.storage.sync.set({ [this.id]: this.value });
}

minimum.addEventListener("blur", handleInputBlur);
maximum.addEventListener("blur", handleInputBlur);

colorSchemeOptions.forEach((colorSchemeOption) =>
  colorSchemeOption.addEventListener("change", (e) =>
    setColorScheme(e.target.value)
  )
);

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
  chrome.storage.sync.set(defaultValues);
  showModel();
});

function showModel() {
  modal.classList.remove("hidden");

  setTimeout(() => {
    modal.classList.remove("visually-hidden");
    page.classList.add("blur");
  }, 20);
}
