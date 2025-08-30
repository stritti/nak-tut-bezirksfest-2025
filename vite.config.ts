import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: { enabled: true },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
