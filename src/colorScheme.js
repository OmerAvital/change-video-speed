"use strict";

let currentColorScheme;
let preferredColorScheme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches
  ? "dark"
  : "light";

try {
  chrome.storage.sync.get(["colorScheme"], ({ colorScheme }) => {
    currentColorScheme = colorScheme;
    setColorScheme(currentColorScheme);
  });
} catch (e) {
  console.error(e);
  chrome.storage.sync.set({ colorScheme: "auto" }, () =>
    setColorScheme("auto")
  );
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    preferredColorScheme = e.matches ? "dark" : "light";
    setColorScheme(currentColorScheme);
  });

function setColorScheme(scheme) {
  let colorScheme = scheme;

  currentColorScheme = scheme;
  chrome.storage.sync.set({ colorScheme: scheme });

  if (scheme === "auto") {
    colorScheme = preferredColorScheme;
  }

  document.documentElement.setAttribute("data-color-scheme", colorScheme);
}
