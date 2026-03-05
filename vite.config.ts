import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/LIMEWP/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    port: 3000,
  },
})
