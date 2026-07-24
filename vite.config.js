import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // served from https://<user>.github.io/affordable-air-direct-store/
  // (HashRouter means no server rewrites are needed)
  base: process.env.DEPLOY_BASE || '/',
  plugins: [react(), tailwindcss()],
  server: { port: 5173, host: true },
})
