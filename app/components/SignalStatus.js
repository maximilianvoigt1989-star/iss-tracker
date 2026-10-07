"use client";

import { useEffect, useState } from "react";

// Sekündlich neu rendern, damit das Alter der Daten mitläuft.
function useNow(intervalMs) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export default function SignalStatus({ error, lastUpdated }) {
  const now = useNow(1000);

  let state = "pending";
  let text = "VERBINDE …";
  if (error) {
    state = "error";
    text = "KEIN SIGNAL";
  } else if (lastUpdated) {
    const ageSeconds = Math.max(0, Math.round((now - lastUpdated.getTime()) / 1000));
    state = "ok";
    text = `SIGNAL OK · ${ageSeconds} s`;
  }

  return (
    <span className={`signal signal-${state}`}>
      <span className="signal-dot" aria-hidden="true" />
      {text}
    </span>
  );
}
