import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),

    VitePWA({
      registerType: "autoUpdate",

      // IMPORTANT:
      // Use your custom public/sw.js
      strategies: "injectManifest",

      srcDir: "public",
      filename: "sw.js",

      manifest: {
        name: "Supply Chain Management System",
        short_name: "ESF",
        description: "Supply Chain Management System",

        display: "standalone",
        orientation: "portrait",

        theme_color: "#181e53",
        background_color: "#ffffff",

        start_url: "/",
        scope: "/",

        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },

      // Optional but useful with injectManifest
      injectManifest: {
        globPatterns: [
          "**/*.{js,css,html,ico,png,svg,webp}",
        ],
      },
    }),
  ],
});