import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@renamer/core': path.resolve(__dirname, '../../packages/core/src/index.ts')
    }
  },
  optimizeDeps: {
    exclude: ['@renamer/core']
  }
})
