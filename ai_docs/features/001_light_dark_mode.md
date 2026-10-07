# Light/Dark-Mode-Umschalter

## Kontext & Problemstellung
Die App hat nur ein helles Farbschema mit fest codierten Farben in `app/globals.css`. Nutzer wollen zwischen Light und Dark Mode wechseln können. Der Dark Mode soll sich an `ai_docs/images/darkmode_example.png` orientieren.

## Anforderungen
- [ ] Als Nutzer möchte ich per Button zwischen Light und Dark Mode umschalten.
- [ ] Als Nutzer möchte ich, dass meine Wahl beim nächsten Besuch erhalten bleibt.
- [ ] Ohne gespeicherte Wahl folgt die App der Systemeinstellung (`prefers-color-scheme`).
- [ ] Der Dark Mode übernimmt Farben und Stimmung aus `darkmode_example.png`.
- [ ] Alle Farben in `globals.css` werden als CSS-Variablen (`:root` / `[data-theme="dark"]`) definiert, nicht mehr hart codiert.
- [ ] Die Karte (Leaflet) passt sich im Dark Mode an (dunkle Kacheln oder abgedunkelte Darstellung).
- [ ] Kein Aufblitzen des falschen Themes beim Laden (kein FOUC).
- [ ] Der Umschalter ist per Tastatur bedienbar und hat ein `aria-label`, das den Zielmodus nennt.

## Definition of Done
- [ ] Umschalter sichtbar und funktionsfähig, Desktop und Mobile (≤ 520 px).
- [ ] Wahl wird in `localStorage` gespeichert und beim Laden angewendet.
- [ ] Systemeinstellung wird ohne gespeicherte Wahl respektiert.
- [ ] Dark Mode visuell mit der Referenzgrafik abgeglichen.
- [ ] Kontrast Text/Hintergrund in beiden Modi ≥ WCAG AA (4.5:1).
- [ ] Fehlerbox, InfoBox und ISS-Marker sind in beiden Modi lesbar.
- [ ] Automatisierte Tests vorhanden und grün (siehe Abschnitt "Tests").

## Betroffene Bereiche & Technik
- `app/globals.css`: Farben (`#1a1d23`, `#e8ecf1`, `#5b6472`, `#fff`, Fehlerfarben, Marker `#d62828`) in Variablen überführen und Dark-Werte ergänzen.
- `app/layout.js`: Inline-Script im `<head>`, das `data-theme` vor dem ersten Render auf `<html>` setzt; `suppressHydrationWarning` auf `<html>`.
- Neue Komponente `app/components/ThemeToggle.js` (Client Component).
- `app/page.js`: Toggle in Header/Layout einbinden.
- `app/components/IssMap.js`: Tile-Layer aktuell `tile.openstreetmap.org`, braucht eine Dark-Variante oder einen CSS-Filter.
- `app/components/InfoBox.js`: nur Styles über Variablen.

## Tests
Aktuell gibt es keinen Test-Runner im Projekt. Vorschlag: Vitest + React Testing Library (Unit), Playwright (E2E).
- [ ] Unit: `ThemeToggle` schaltet `data-theme` auf `<html>` von `light` → `dark` → `light`.
- [ ] Unit: Klick speichert den Modus in `localStorage` (`theme`-Key).
- [ ] Unit: Ohne `localStorage`-Wert wird `prefers-color-scheme: dark` (gemockt mit `matchMedia`) übernommen.
- [ ] Unit: Ein gespeicherter Wert hat Vorrang vor der Systemeinstellung.
- [ ] Unit: Wirft `localStorage` eine Exception (Privatmodus), funktioniert der Umschalter trotzdem ohne Absturz.
- [ ] Unit: `aria-label` wechselt passend zum Zielmodus.
- [ ] E2E: Seite mit gespeichertem `dark` neu laden → `<html data-theme="dark">` ist sofort gesetzt (kein Light-Flash).
- [ ] E2E: Im Dark Mode ist der Body-Hintergrund dunkel (berechnete Farbe ≠ `#e8ecf1`), und die Karte lädt die Dark-Kacheln bzw. hat den Filter.

## Umsetzungsideen / Hinweise (optional)
- Theme über das Attribut `data-theme` auf `<html>` steuern, Variablen in `:root` und `:root[data-theme="dark"]`.
- Dark-Kacheln z. B. CARTO `dark_all` (Attribution beachten); alternativ `filter: invert(1) hue-rotate(180deg)` auf `.leaflet-tile-pane`.
- Icon-Button (Sonne/Mond) oben rechts, ohne zusätzliche Abhängigkeit.

## Offene Fragen / Abhängigkeiten (optional)
- **`ai_docs/images/darkmode_example.png` fehlt im Repo.** - ist jetzt abgelegt, Farben daraus übernehmen
- Dark-Kacheln: externer Anbieter (CARTO) oder CSS-Filter auf OSM-Kacheln? - CSS-Filter auf OSM-Kacheln
- Soll es neben Hell und Dunkel einen dritten Zustand „System“ geben? Annahme: nein. - mache das so
- Welcher Test-Runner soll eingeführt werden? - Vitest + React Testing Library (jsdom), kein Playwright. E2E-Fälle werden manuell im Browser geprüft.
### Entscheidungen nach Vorliegen von `darkmode_example.png`
- Farben aus dem Bild übernommen: Hintergrund `#0a0f14`, Flächen `#0d1217`, Kartengrund `#0d151c`, Linien `#1e2a35`, Grün-Akzent `#34d399`, Fehler-Rot `#e5534b` (Rahmen) / `#ff9a8f` (Text). Alle als Tokens in `app/globals.css`.
- Layout wie im Bild, in beiden Modi gleich: Kopfzeile mit „ISS • LIVE“, „NORAD 25544“, Statusanzeige und Umschalter; Messwerte als Spalte rechts (kleine Labels in Großbuchstaben, große Werte, Einheit klein daneben); Fehlerhinweis als rot umrandete Box „KEIN SIGNAL“ in dieser Spalte.
- Statusanzeige: „SIGNAL OK · N s“ (grün) zeigt das Alter der letzten erfolgreichen Abfrage in Sekunden und läuft sekündlich mit; bei Fehler „KEIN SIGNAL“ (rot); vor dem ersten Abruf „VERBINDE …“ (neutral). Ersetzt die frühere Zeile „Aktualisiert“ und das Lade-Banner.
- Marker im Dark Mode: grünes Fadenkreuz (`L.divIcon` mit Inline-SVG, Farbe per `currentColor`). Light Mode behält den Satelliten-Marker. Wechsel per `marker.setIcon()`; die Karte wird beim Theme-Wechsel nicht neu initialisiert. Das Theme liest die Karte über den Hook `useTheme` (beobachtet `data-theme` auf `<html>`).
- Schrift: Monospace (System-Stack, kein Webfont-Download) im Dark Mode, Standardschrift im Light Mode.
- Karte: echte OSM-Kacheln, im Dark Mode per CSS-Filter abgedunkelt und entsättigt. Kein Raster, keine Bahnlinie (gehört zu Bonus B1).
- Mobil (≤ 520 px): Werte-Spalte rutscht unter die Karte (Karte 55vh, Werte zweispaltig).
