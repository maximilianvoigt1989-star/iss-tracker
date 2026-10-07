import { defineConfig } from "vitest/config";

export default defineConfig({
  // Komponenten liegen als .js mit JSX vor (Next.js-Konvention).
  oxc: {
    include: /app\/.*\.js$/,
    exclude: /node_modules/, // Default schließt alle .js-Dateien aus
    lang: "jsx",
    jsx: { runtime: "automatic" },
  },
  test: {
    environment: "jsdom",
    include: ["app/**/*.test.js"],
    setupFiles: ["./vitest.setup.mjs"],
  },
});
