import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/favicon.ico', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'The Inner Compass 內在羅盤',
        short_name: 'Inner Compass',
        description: 'A quiet check-in on where your practice stands today.',
        theme_color: '#5f4b8b',
        background_color: '#f3f1f8',
        display: 'standalone',
        icons: [
          { src: 'icons/icon192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/iconMaskable512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
      },
    }),
  ],
});
