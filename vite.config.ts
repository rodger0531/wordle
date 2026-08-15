import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Deployed to https://rodger0531.github.io/wordle, so assets must be served
// from the /wordle/ sub-path in production and in preview, but from / in dev.
export default defineConfig(({ command, isPreview }) => ({
  base: command === "build" || isPreview ? "/wordle/" : "/",
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: "dist",
  },
}));
