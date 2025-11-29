import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Use a relative base so the built site works when served from
  // GitHub Pages at a subpath and when served locally.
  base: './',
});
