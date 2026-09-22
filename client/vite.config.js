import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      manifest: {
        name: 'Triboo',
        short_name: 'Triboo',
        description: 'Gestion des tâches, mémos, rendez-vous et courses du foyer',
        theme_color: '#121110',
        background_color: '#121110',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: 'notes.png', sizes: '512x512', type: 'image/png' },
        ]
      }
    })
  ]
})
