import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'
import { createHead } from '@vueuse/head'
import path from 'path'

dotenv.config()

export default defineConfig({
  build: {
    terserOptions: {
      compress: {
        warnings: false,
        drop_console: true,
      },
      output: {
        comments: function(node, comment) {
          var text = comment.value;
          var type = comment.type;
          if (type == "comment2") {
            // multiline comment
            return /@license/i.test(text);
          }
        },
      beautify: false,
      },

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
  },
})