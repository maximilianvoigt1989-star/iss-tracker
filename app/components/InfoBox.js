const numberFormat = (digits) =>
  new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

const coordFormat = numberFormat(4);
const intFormat = numberFormat(0);

export default function InfoBox({ position }) {
  const placeholder = "–";
  const rows = [
    ["Breite", position ? `${coordFormat.format(position.latitude)}°` : placeholder, null],
    ["Länge", position ? `${coordFormat.format(position.longitude)}°` : placeholder, null],
    ["Höhe", position ? intFormat.format(position.altitude) : placeholder, "km"],
    ["Geschwindigkeit", position ? intFormat.format(position.velocity) : placeholder, "km/h"],
  ];

  return (
    <dl className="readout-list">
      {rows.map(([label, value, unit]) => (
        <div key={label} className="readout-row">
          <dt className="readout-label">{label}</dt>
          <dd className="readout-value">
            {value}
            {unit && position && <span className="readout-unit">{unit}</span>}
          </dd>
        </div>
      ))}
    </dl>
  );
}
