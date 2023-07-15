import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vavite from 'vavite';

import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    manifest: true,
    rollupOptions: {
      input: '/src/entry-client.tsx',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
    }
  },
  plugins: [react(), vavite({
    serverEntry: "/src/entry-server.tsx",
    serveClientAssetsInDev: true,
    // Don't reload when dynamically imported dependencies change
    reloadOn: "static-deps-change",
  }),],
})
