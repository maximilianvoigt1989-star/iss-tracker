import "leaflet/dist/leaflet.css";
import "./globals.css";
import { themeInitScript } from "./lib/theme";

export const metadata = {
  title: "ISS-Live-Tracker",
  description: "Aktuelle Position der Internationalen Raumstation live auf der Karte",
};

export default function RootLayout({ children }) {
  return (
    // data-theme wird vom Inline-Script vor der Hydrierung gesetzt.
    <html lang="de" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
