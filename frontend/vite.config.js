import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  test: {
    globals: true, // Enable global variables for Vitest
    environment: 'jsdom', // Use jsdom for DOM testing
    setupFiles: './src/setupTests.js', // Optional: Setup file for global configurations
  },
})
