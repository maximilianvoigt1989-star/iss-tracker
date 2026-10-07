import { act, render, waitFor } from "@testing-library/react";
import L from "leaflet";
import { describe, expect, it, vi } from "vitest";
import IssMap from "./IssMap";

const position = { latitude: -5.19, longitude: 151.37, altitude: 419, velocity: 27586 };
const markerHtml = (container) => container.querySelector(".leaflet-marker-icon")?.outerHTML ?? "";

async function setTheme(theme) {
  await act(async () => {
    document.documentElement.dataset.theme = theme;
  });
}

describe("IssMap", () => {
  it("zeigt im Dark Mode das Fadenkreuz", async () => {
    document.documentElement.dataset.theme = "dark";
    const { container } = render(<IssMap position={position} />);

    expect(container.querySelector(".iss-marker-crosshair svg")).not.toBeNull();
  });

  it("zeigt im Light Mode den Satelliten-Marker", () => {
    document.documentElement.dataset.theme = "light";
    const { container } = render(<IssMap position={position} />);

    expect(container.querySelector(".iss-marker-dot")).not.toBeNull();
    expect(container.querySelector(".iss-marker-crosshair")).toBeNull();
  });

  it("tauscht beim Theme-Wechsel das Icon, ohne die Karte neu zu erstellen", async () => {
    document.documentElement.dataset.theme = "light";
    const mapSpy = vi.spyOn(L, "map");
    const { container } = render(<IssMap position={position} />);
    const markerBefore = container.querySelector(".leaflet-marker-pane");

    await setTheme("dark");
    await waitFor(() => expect(markerHtml(container)).toContain("iss-marker-crosshair"));

    await setTheme("light");
    await waitFor(() => expect(markerHtml(container)).toContain("iss-marker-dot"));

    expect(mapSpy).toHaveBeenCalledTimes(1);
    expect(container.querySelector(".leaflet-marker-pane")).toBe(markerBefore);
    expect(container.querySelectorAll(".leaflet-marker-icon")).toHaveLength(1);
  });
});
