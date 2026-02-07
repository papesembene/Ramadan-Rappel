import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icons/icon.svg", "adhan.mp3"],
      manifest: {
        name: "Ramadan Rappel",
        short_name: "Rappel",
        description: "Rappels quotidiens et horaires d'iftar/suhoor pour le Sénégal.",
        theme_color: "#0b0f12",
        background_color: "#0b0f12",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "icons/icon.svg",
            sizes: "any",
            type: "image/svg+xml"
          }
        ]
      },
      workbox: {
        navigateFallback: "/index.html",
        globPatterns: ["**/*.{js,css,html,svg,json,woff2,mp3}"]
      },
      srcDir: "src",
      filename: "sw.js",
      strategies: "injectManifest"
    })
  ]
});
