"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import useTheme from "../lib/useTheme";

// Eigene divIcons statt des Standard-Icons, dessen Bildpfade in Bundlern oft brechen.
const lightIcon = L.divIcon({
  className: "iss-marker",
  html: '<span class="iss-marker-dot" aria-hidden="true">🛰️</span>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

// Fadenkreuz; Farbe kommt per currentColor aus dem CSS-Token --color-accent.
const darkIcon = L.divIcon({
  className: "iss-marker iss-marker-crosshair",
  html: `<svg viewBox="0 0 56 56" width="56" height="56" aria-hidden="true">
    <circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" stroke-opacity="0.45" />
    <circle cx="28" cy="28" r="12" fill="none" stroke="currentColor" stroke-width="1.5" />
    <circle cx="28" cy="28" r="5" fill="currentColor" />
    <path d="M0 28H18M38 28H56M28 0V18M28 38V56" stroke="currentColor" stroke-width="1.5" />
  </svg>`,
  iconSize: [56, 56],
  iconAnchor: [28, 28],
});

export const iconForTheme = (theme) => (theme === "dark" ? darkIcon : lightIcon);

export default function IssMap({ position }) {
  const theme = useTheme();
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {
    const map = L.map(containerRef.current, {
      center: [0, 0],
      zoom: 2,
      minZoom: 2,
      worldCopyJump: true,
    });

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende',
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !position) return;

    const latLng = [position.latitude, position.longitude];
    if (!markerRef.current) {
      markerRef.current = L.marker(latLng, { icon: iconForTheme(theme), title: "ISS" }).addTo(map);
      map.setView(latLng, 3);
    } else {
      markerRef.current.setLatLng(latLng);
    }
    // theme bewusst nicht in den Deps: der Wechsel läuft über den Effekt unten.
  }, [position]);

  // Beim Theme-Wechsel nur das Icon tauschen, die Karte bleibt bestehen.
  useEffect(() => {
    markerRef.current?.setIcon(iconForTheme(theme));
  }, [theme]);

  return <div ref={containerRef} className="map" />;
}
