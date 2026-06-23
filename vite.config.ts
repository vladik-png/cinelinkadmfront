import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/metrics-proxy': {
        target: 'http://164.92.225.126:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/metrics-proxy/, '')
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['src/setupTests.ts'],
  }
})