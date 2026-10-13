import react from '@vitejs/plugin-react'
import path from 'node:path'
import { defineConfig } from 'vite'

const root = import.meta.dirname

export default defineConfig({
  // Project Pages URL: https://davidjsilveira.github.io/labtag-solutions/
  base: process.env.GITHUB_PAGES === 'true' ? '/labtag-solutions/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(root, './src'),
      '@pages': path.resolve(root, '../pages'),
    },
  },
  server: {
    fs: {
      allow: [path.resolve(root, '..')],
    },
  },
})
