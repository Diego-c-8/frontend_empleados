import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',  // For React 19's new JSX transform
    jsxImportSource: 'react'
  })],
  server: {
    proxy: {
      '/api': 'http://localhost:3001'  // Proxy backend requests
    }
  }
})