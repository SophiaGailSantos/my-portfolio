import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from /<repo-name>/, but Vercel serves it from
  // the domain root. Vercel sets VERCEL=1 during builds, so pick the right
  // base per environment instead of hard-coding one and breaking the other.
  base: process.env.VERCEL ? '/' : '/my-portfolio/',
})