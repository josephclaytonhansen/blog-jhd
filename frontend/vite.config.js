import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [vue()],
  define: {
    'process.env.VUE_APP_SERVER_URL': JSON.stringify(process.env.VITE_APP_SERVER_URL),
  },
})