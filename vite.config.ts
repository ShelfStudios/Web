import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

// Ensure public folder and favicon exist
const setupPublicFolder = () => {
  const publicDir = join(process.cwd(), 'public');
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }
  const faviconSrc = join(process.cwd(), 'Assets', 'Favicon.png');
  const faviconDest = join(publicDir, 'favicon.png');
  if (existsSync(faviconSrc) && !existsSync(faviconDest)) {
    copyFileSync(faviconSrc, faviconDest);
  }
};

setupPublicFolder();

export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'public',
});
