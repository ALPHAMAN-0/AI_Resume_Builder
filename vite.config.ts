import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: '/AI_Resume_Builder/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
