"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import InfoBox from "./components/InfoBox";

// Leaflet greift auf window zu – deshalb nur im Browser laden.
const IssMap = dynamic(() => import("./components/IssMap"), {
  ssr: false,
  loading: () => <div className="map-placeholder">Karte wird geladen …</div>,
});

const API_URL = "https://api.wheretheiss.at/v1/satellites/25544";
const POLL_INTERVAL_MS = 5000;
const REQUEST_TIMEOUT_MS = 8000;

async function fetchIssPosition(signal) {
  const res = await fetch(API_URL, { cache: "no-store", signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const latitude = Number(data.latitude);
  const longitude = Number(data.longitude);
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    throw new Error("Ungültige Antwort der API");
  }
  return {
    latitude,
    longitude,
    altitude: Number(data.altitude),
    velocity: Number(data.velocity),
  };
}

export default function Home() {
  const [position, setPosition] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = null;
    let controller = null;

    // Nächster Request wird erst nach Abschluss des vorherigen geplant,
    // dadurch überlappen sich Requests nie.
    async function poll() {
      controller = new AbortController();
      const abortTimer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
      try {
        const next = await fetchIssPosition(controller.signal);
        if (cancelled) return;
        setPosition(next);
        setLastUpdated(new Date());
        setError(null);
      } catch (err) {
        if (cancelled) return;
        console.warn("ISS-Abruf fehlgeschlagen:", err);
        setError(
          "Die ISS-Daten können gerade nicht abgerufen werden. Neuer Versuch läuft automatisch …"
        );
      } finally {
        clearTimeout(abortTimer);
        if (!cancelled) timeoutId = setTimeout(poll, POLL_INTERVAL_MS);
      }
    }

    poll();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      controller?.abort();
    };
  }, []);

  return (
    <main className="app">
      <IssMap position={position} />

      <InfoBox position={position} lastUpdated={lastUpdated} />

      {error && (
        <div className="banner banner-error" role="alert">
          {error}
          {position && " Angezeigt wird die letzte bekannte Position."}
        </div>
      )}

      {!position && !error && (
        <div className="banner banner-info" role="status">
          ISS-Position wird geladen …
        </div>
      )}
    </main>
  );
}
