// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true
  },
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  router: {
    middleware: ['beforeEach'],
  },
  plugins: ['~/plugins/toast.js'],
})