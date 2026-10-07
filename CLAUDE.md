# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projekt

ISS-Live-Tracker: reine Frontend-App (Next.js App Router, React 19, Leaflet), die die ISS-Position live auf einer Karte zeigt. Anforderungen stehen in `ai_docs/PRD.md` (F1–F4 Muss, B1–B4 Bonus), Feature-Specs in `ai_docs/features/NNN_*.md`. Projektsprache ist Deutsch (UI-Texte, Kommentare, Testnamen, Commit-Messages).

## Befehle

```bash
npm run dev                                         # Dev-Server (localhost:3000)
npm run build                                       # Produktions-Build
npm test                                            # alle Tests (vitest run)
npx vitest run app/components/IssMap.test.js        # einzelne Testdatei
npx vitest run -t "tauscht beim Theme-Wechsel"      # einzelner Test nach Name
```

Kein Linter konfiguriert. Deployment über Vercel (`npx vercel --prod`, siehe Skill `deploy-to-vercel`).

## Architektur

- **Quellcode liegt ausschließlich in `app/`** (PRD-Vorgabe). Komponenten sind `.js`-Dateien mit JSX; `vitest.config.mjs` aktiviert JSX für `app/**/*.js` per `oxc`, weil Vitest `.js` sonst nicht als JSX parst.
- **Kein Backend.** `app/page.js` ist eine Client Component und pollt `https://api.wheretheiss.at/v1/satellites/25544` direkt im Browser: alle 5 s, Timeout 8 s per `AbortController`. Der nächste Request wird erst nach Abschluss des vorherigen geplant (verkettetes `setTimeout`, kein `setInterval`), damit sich Requests nicht überlappen. Bei Fehlern bleibt die letzte Position sichtbar, ein Hinweis erscheint und das Polling läuft weiter.
- **Nur HTTPS-Quellen.** Open Notify (HTTP) würde nach dem Deploy Mixed-Content-Fehler auslösen und ist deshalb nicht erlaubt. Ein Proxy unter `app/api/` ist nur für Bonus B4 vorgesehen.
- **Leaflet nur clientseitig:** `IssMap` wird in `page.js` per `next/dynamic` mit `ssr: false` geladen. Die Karte wird einmal beim Mount erstellt; Positions- und Theme-Updates verändern nur den Marker (`setLatLng` / `setIcon`) und bauen die Karte nie neu auf. Marker sind `L.divIcon`s, weil die Bildpfade des Standard-Icons in Bundlern brechen.
- **Theme (Light/Dark):** Quelle der Wahrheit ist `data-theme` auf `<html>`.
  - `app/lib/theme.js` enthält `themeInitScript`, das in `layout.js` als Inline-Script im `<head>` läuft und so das Aufblitzen des falschen Themes (FOUC) verhindert. Es ist absichtlich ein String; Änderungen an der Theme-Logik müssen dort und in den Helfern daneben übereinstimmen.
  - Priorität: Wert aus `localStorage` (Key `theme`), sonst `prefers-color-scheme`. Jeder Zugriff auf `localStorage` steht in try/catch (Privatmodus).
  - `app/lib/useTheme.js` liest das Attribut über `useSyncExternalStore` + `MutationObserver`; es gibt keinen React Context.
  - Farben sind CSS-Variablen in `app/globals.css` (`:root` / `:root[data-theme="dark"]`). Die Dark-Kacheln entstehen über einen CSS-Filter (`--map-tile-filter`), nicht über einen anderen Tile-Server.

## Tests

Vitest + React Testing Library + jsdom; Tests liegen neben der Komponente (`*.test.js`). `vitest.setup.mjs` räumt nach jedem Test automatisch auf: Mocks, gestubbte Globals, `localStorage` und `data-theme`.

## Skills

- `create-feature`: legt eine neue Spec `ai_docs/features/NNN_<slug>.md` an (nur die Spec, kein Code).
- `vercel-react-best-practices`, `web-design-guidelines`, `deploy-to-vercel`: aus `vercel-labs/agent-skills`, Versionen in `skills-lock.json`. `.agents/` ist lokal und per `.gitignore` ausgeschlossen.
