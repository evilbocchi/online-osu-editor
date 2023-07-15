import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vavite from 'vavite';

import path from "node:path";
import { ssr } from 'vite-plugin-ssr/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '#root': path.resolve(__dirname, './pages/'),
    }
  },
  plugins: [react(), ssr({ prerender: true })],
})

/**
 vavite({
    serverEntry: "/src/entry-server.tsx",
    serveClientAssetsInDev: true,
    // Don't reload when dynamically imported dependencies change
    reloadOn: "static-deps-change",
  }),
 */