"use client";

import { useEffect, useState } from "react";
import { applyTheme, resolveTheme, storeTheme } from "../lib/theme";

export default function ThemeToggle() {
  // Auf dem Server ist das Theme unbekannt; erst nach dem Mount auflösen,
  // damit Server- und Client-Markup beim Hydrieren übereinstimmen.
  const [theme, setTheme] = useState(null);

  useEffect(() => {
    const initial = resolveTheme();
    applyTheme(initial);
    setTheme(initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    applyTheme(next);
    storeTheme(next);
    setTheme(next);
  }

  const isDark = theme === "dark";
  const label = isDark ? "Zum hellen Modus wechseln" : "Zum dunklen Modus wechseln";

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
      disabled={theme === null}
    >
      <span aria-hidden="true">{isDark ? "☀️" : "🌙"}</span>
    </button>
  );
}
