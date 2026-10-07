"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";

// Eigenes divIcon statt des Standard-Icons, dessen Bildpfade in Bundlern oft brechen.
const issIcon = L.divIcon({
  className: "iss-marker",
  html: '<span class="iss-marker-dot" aria-hidden="true">🛰️</span>',
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

export default function IssMap({ position }) {
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
      markerRef.current = L.marker(latLng, { icon: issIcon, title: "ISS" }).addTo(map);
      map.setView(latLng, 3);
    } else {
      markerRef.current.setLatLng(latLng);
    }
  }, [position]);

  return <div ref={containerRef} className="map" />;
}
