import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import { createHead } from '@vueuse/head'

dotenv.config()

export default defineConfig({
  plugins: [vue(), createHead()], 
  define: {
    'process.env.VUE_APP_SERVER_URL': JSON.stringify(process.env.VITE_APP_SERVER_URL),
    'process.env.VUE_APP_FRONTEND_PREFIXES': JSON.stringify(process.env.VITE_APP_FRONTEND_PREFIXES.split(',')),
  },
})