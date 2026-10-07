import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import ThemeToggle from "./ThemeToggle";
import { THEME_STORAGE_KEY, themeInitScript } from "../lib/theme";

function mockSystemTheme(theme) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query) => ({
      matches: query === "(prefers-color-scheme: dark)" && theme === "dark",
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  );
}

const html = () => document.documentElement;

describe("ThemeToggle", () => {
  it("schaltet data-theme von light → dark → light", () => {
    mockSystemTheme("light");
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    expect(html().dataset.theme).toBe("light");
    fireEvent.click(button);
    expect(html().dataset.theme).toBe("dark");
    fireEvent.click(button);
    expect(html().dataset.theme).toBe("light");
  });

  it("speichert die Wahl in localStorage", () => {
    mockSystemTheme("light");
    render(<ThemeToggle />);

    fireEvent.click(screen.getByRole("button"));
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });

  it("übernimmt prefers-color-scheme: dark ohne gespeicherten Wert", () => {
    mockSystemTheme("dark");
    render(<ThemeToggle />);

    expect(html().dataset.theme).toBe("dark");
  });

  it("gibt dem gespeicherten Wert Vorrang vor der Systemeinstellung", () => {
    mockSystemTheme("dark");
    window.localStorage.setItem(THEME_STORAGE_KEY, "light");
    render(<ThemeToggle />);

    expect(html().dataset.theme).toBe("light");
  });

  it("funktioniert ohne Absturz, wenn localStorage wirft", () => {
    mockSystemTheme("light");
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });
    render(<ThemeToggle />);

    expect(html().dataset.theme).toBe("light");
    fireEvent.click(screen.getByRole("button"));
    expect(html().dataset.theme).toBe("dark");
  });

  it("nennt im aria-label den Zielmodus", () => {
    mockSystemTheme("light");
    render(<ThemeToggle />);
    const button = screen.getByRole("button");

    expect(button).toHaveAccessibleName("Zum dunklen Modus wechseln");
    fireEvent.click(button);
    expect(button).toHaveAccessibleName("Zum hellen Modus wechseln");
  });
});

describe("themeInitScript", () => {
  const runScript = () => new Function(themeInitScript)();

  it("setzt das gespeicherte Theme vor dem Rendern", () => {
    mockSystemTheme("light");
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");
    runScript();

    expect(html().dataset.theme).toBe("dark");
  });

  it("fällt ohne gespeicherten Wert auf die Systemeinstellung zurück", () => {
    mockSystemTheme("dark");
    runScript();

    expect(html().dataset.theme).toBe("dark");
  });

  it("ignoriert ungültige gespeicherte Werte", () => {
    mockSystemTheme("light");
    window.localStorage.setItem(THEME_STORAGE_KEY, "purple");
    runScript();

    expect(html().dataset.theme).toBe("light");
  });
});
