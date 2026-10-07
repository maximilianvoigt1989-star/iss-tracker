"use client";

import { useSyncExternalStore } from "react";

// Quelle der Wahrheit ist das data-theme-Attribut auf <html>; so reagieren
// alle Komponenten auf den Umschalter, ohne einen eigenen Context zu brauchen.
function subscribe(onChange) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

function getSnapshot() {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

function getServerSnapshot() {
  return "light";
}

export default function useTheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
