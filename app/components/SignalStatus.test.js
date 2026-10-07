import { act, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import SignalStatus from "./SignalStatus";

afterEach(() => {
  vi.useRealTimers();
});

describe("SignalStatus", () => {
  it("zeigt vor dem ersten Abruf einen neutralen Verbindungsstatus", () => {
    render(<SignalStatus error={null} lastUpdated={null} />);

    expect(screen.getByText("VERBINDE …")).toHaveClass("signal-pending");
  });

  it("zeigt SIGNAL OK mit dem Alter der Daten in Sekunden", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-10-07T12:00:05Z"));
    render(<SignalStatus error={null} lastUpdated={new Date("2026-10-07T12:00:00Z")} />);

    expect(screen.getByText("SIGNAL OK · 5 s")).toHaveClass("signal-ok");

    act(() => vi.advanceTimersByTime(2000));
    expect(screen.getByText("SIGNAL OK · 7 s")).toBeInTheDocument();
  });

  it("zeigt KEIN SIGNAL bei Fehler, auch wenn es ältere Daten gibt", () => {
    render(<SignalStatus error="Fehler" lastUpdated={new Date()} />);

    expect(screen.getByText("KEIN SIGNAL")).toHaveClass("signal-error");
  });
});
