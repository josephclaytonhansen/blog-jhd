import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import { createHead } from '@vueuse/head'
import path from 'path'

dotenv.config()

export default defineConfig({
  build: {
    minify: 'esbuild',
    esbuild: {
      legalComments: 'none',
      minify: true,
      minifyWhitespace: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      treeShaking: true,
      
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '/src')
    }
  },
  plugins: [vue(), createHead()], 
  define: {
    'process.env.VUE_APP_SERVER_URL': JSON.stringify(process.env.VITE_APP_SERVER_URL),
    'process.env.VUE_APP_FRONTEND_PREFIXES': JSON.stringify(process.env.VITE_APP_FRONTEND_PREFIXES.split(',')),
    'process.env.VUE_APP_MATOMO_URL': JSON.stringify(process.env.VITE_APP_MATOMO_URL),
  },
})