export const THEME_STORAGE_KEY = "theme";
export const THEMES = ["light", "dark"];

// localStorage kann im Privatmodus oder bei blockierten Site-Daten werfen.
export function readStoredTheme() {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return THEMES.includes(value) ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Wahl gilt dann nur für diese Sitzung.
  }
}

export function getSystemTheme() {
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Gespeicherte Wahl hat Vorrang vor der Systemeinstellung.
export function resolveTheme() {
  return readStoredTheme() ?? getSystemTheme();
}

export function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

// Läuft als Inline-Script im <head> vor dem ersten Render (kein Aufblitzen des
// falschen Themes). Muss eigenständig sein, deshalb als String statt Import.
export const themeInitScript = `(function () {
  var theme = null;
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    if (stored === "light" || stored === "dark") theme = stored;
  } catch (e) {}
  if (!theme) {
    theme = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  document.documentElement.dataset.theme = theme;
})();`;
