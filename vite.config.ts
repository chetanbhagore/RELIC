import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) {
            return 'three-core';
          }
          if (id.includes('node_modules/@react-three/fiber/')) {
            return 'three-fiber';
          }
          if (id.includes('node_modules/@react-three/drei/')) {
            return 'three-drei';
          }
          if (id.includes('node_modules/three-stdlib/')) {
            return 'three-stdlib';
          }
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-core';
          }
          if (id.includes('node_modules/lucide-react/') || id.includes('node_modules/zustand/') || id.includes('node_modules/canvas-confetti/')) {
            return 'ui-vendor';
          }
        },
      },
    },
  },
})
