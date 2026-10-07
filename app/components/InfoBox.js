const numberFormat = (digits) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const coordFormat = numberFormat(4);
const intFormat = numberFormat(0);
const timeFormat = new Intl.DateTimeFormat("de-DE", {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

export default function InfoBox({ position, lastUpdated }) {
  const placeholder = "–";
  const rows = [
    ["Breite", position ? `${coordFormat.format(position.latitude)}°` : placeholder],
    ["Länge", position ? `${coordFormat.format(position.longitude)}°` : placeholder],
    ["Höhe", position ? `${intFormat.format(position.altitude)} km` : placeholder],
    ["Geschwindigkeit", position ? `${intFormat.format(position.velocity)} km/h` : placeholder],
    ["Aktualisiert", lastUpdated ? `${timeFormat.format(lastUpdated)} Uhr` : placeholder],
  ];

  return (
    <aside className="infobox" aria-label="ISS-Daten">
      <h1>ISS live</h1>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label} className="row">
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}
