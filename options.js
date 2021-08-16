"use strict";

const minimum = document.getElementById("min");
const maximum = document.getElementById("max");
const save = document.getElementById("save");
const reset = document.getElementById("reset");
const doneModal = document.getElementById("done-modal");
const overlay = document.querySelector(".overlay");
let delay = 0;

chrome.storage.sync.get(["min", "max"], ({ min, max }) => {
  minimum.value = min;
  maximum.value = max;
});

save.addEventListener("click", () => {
  delay = 0;
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

overlay.addEventListener('dblclick', () => {
    hideModel();
});

reset.addEventListener("click", () => {
  chrome.storage.sync.set({ speed: 1, min: 0.5, max: 3 });
  minimum.value = 0.5;
  maximum.value = 3;
});

function hideModel() {
  overlay.classList.add("visually-hidden");
  doneModal.classList.add("visually-hidden");

  overlay.addEventListener(
    "transitionend",
    () => {
      overlay.classList.add("hidden");
    },
    { capture: false, once: true, passive: false }
  );
  doneModal.addEventListener(
    "transitionend",
    () => {
      doneModal.classList.add("hidden");
    },
    { capture: false, once: true, passive: false }
  );
}

function showModel() {
  overlay.classList.remove("hidden");
  doneModal.classList.remove("hidden");

  setTimeout(() => {
    overlay.classList.remove("visually-hidden");
    doneModal.classList.remove("visually-hidden");
  }, 20);
}
