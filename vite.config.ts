import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import vavite from 'vavite';

import path from "node:path";
import { ssr } from 'vite-plugin-ssr/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '#': path.resolve(__dirname, './src/'),
    }
  },
  plugins: [react()],
})