import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Deployed to https://rodger0531.github.io/wordle, so assets must be served
// from the /wordle/ sub-path in production but from / during local dev.
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/wordle/" : "/",
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
}));
