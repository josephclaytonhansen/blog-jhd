import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router.js'
import 'tailwindcss/tailwind.css'

import {createPinia} from 'pinia'

import piniaPluginPersistedState from "pinia-plugin-persistedstate"


const pinia = createPinia()
pinia.use(piniaPluginPersistedState)

export {pinia}

import {userStore} from './userStore'

const toastOptions = {}

const app = createApp(App)

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

app.use(Toast, toastOptions)
app.use(pinia)
app.use(router)
app.mount('#app')
