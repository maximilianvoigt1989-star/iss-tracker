import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import InfoBox from "./InfoBox";

describe("InfoBox", () => {
  it("zeigt die vier Messwerte mit Einheiten im deutschen Format", () => {
    render(
      <InfoBox position={{ latitude: -5.19389, longitude: 151.37431, altitude: 419.2, velocity: 27586.4 }} />
    );

    expect(screen.getByText("Breite").nextSibling).toHaveTextContent("-5,1939°");
    expect(screen.getByText("Länge").nextSibling).toHaveTextContent("151,3743°");
    expect(screen.getByText("Höhe").nextSibling).toHaveTextContent("419km");
    expect(screen.getByText("Geschwindigkeit").nextSibling).toHaveTextContent("27.586km/h");
  });

  it("zeigt Platzhalter ohne Einheiten, solange keine Position da ist", () => {
    render(<InfoBox position={null} />);

    expect(screen.getAllByText("–")).toHaveLength(4);
    expect(screen.queryByText("km")).toBeNull();
  });
});
