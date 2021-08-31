"use strict";

let currentColorScheme;
let preferredColorScheme = window.matchMedia("(prefers-color-scheme: dark)")
  .matches
  ? "dark"
  : "light";

try {
  chrome.storage.sync.get(["colorScheme"], ({ colorScheme }) => {
    if (colorScheme === undefined) {
      throw new Error("Color scheme not saved.");
    }

    currentColorScheme = colorScheme;
    setColorScheme(currentColorScheme);
  });
} catch (e) {
  // setColorScheme("auto");
  setColorScheme("dark");
  chrome.storage.sync.set({ colorScheme: "auto" });
}

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", (e) => {
    if (currentColorScheme === "auto") {
      preferredColorScheme = e.matches ? "dark" : "light";
      setColorScheme("auto");
    }
  });

function setColorScheme(scheme) {
  const colorScheme = scheme === "auto" ? preferredColorScheme : scheme;
  document.documentElement.setAttribute("data-color-scheme", colorScheme);

  currentColorScheme = scheme;
  chrome.storage.sync.set({ colorScheme: scheme });
}
