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

const toastOptions = {
    position: "top-right",
    timeout: 3000,
    closeOnClick: false,
    pauseOnFocusLoss: false,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: "button",
    icon: true,
    rtl: false,
    shadow: false,
    maxToasts: 3,
    transition: "Vue-Toastification__bounce",
    newestOnTop: true,
    className: 'toast',
}

const app = createApp(App)

import Toast from "vue-toastification"
import "vue-toastification/dist/index.css"

app.use(Toast, toastOptions)
app.use(pinia)
app.use(router)
app.mount('#app')
