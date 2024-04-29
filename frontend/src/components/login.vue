<script setup>
import {userStore} from "../userStore"
import {pinia} from '../main.js'
import { useToast } from "vue-toastification"
const toast = useToast()
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('')
const password = ref('')
const displayName = ref('')
const isRegistering = ref(false)

const attemptLogin = () => {
    if (!username.value) {
        toast.error('Please enter an email address')
        return
    }
    if (!password.value) {
        toast.error('Please enter a password')
        return
    }
    const store = userStore(pinia)
    toast.info('Logging in...')
    let u = username.value
    let p = password.value
    let params = {
        email: u,
        password: p
    }
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            },
            withCredentials: true
        }
    let url = 'http://localhost:3720/user/login'
    try{
    axios.post(url, params, config)
    .then((response) => {
        toast.success('Login successful')
        if (response.data) {
            store.login(response.data)
            setTimeout(() => {
                router.push('/')
            }, 2000)
        }
    })
    .catch((error) => {
        toast.error(error.message || error.error || 'Error logging in')
    })
} catch (error) {
    toast.error(error.message || error.error || 'Error logging in')
}
}

const registerUser = () => {
    if (!displayName.value) {
        toast.error('Please enter a display name')
        return
    }
    if (!username.value) {
        toast.error('Please enter an email address')
        return
    }
    if (!password.value) {
        toast.error('Please enter a password')
        return
    }
    if (password.value.length <= 12) {
        toast.error('Password must be at least 12 characters')
        return
    }
    if (displayName.value.length <= 8) {
        toast.error('Display name must be at least 8 characters')
        return
    }
    if (displayName.value.length > 48) {
        toast.error('Display name cannot be more than 48 characters')
        return
    }

    const store = userStore(pinia)
    toast.info('Registering...')
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    let url = 'http://localhost:3720/user/create'
    axios.post(url, {
        email: username.value,
        password: password.value,
        displayName: displayName.value
    }, config).then((response) => {
        toast.success('Your registration was successful. Please check your email for verification.')
        if (response.data) {
            store.login(response.data)
            setTimeout(() => {
                router.push('/')
            }, 2000)
        }
    }).catch((error) => {
        toast.error(error.response.data.message || error.message || error.error || 'Error creating user')
    })
}

const showRegister = () => {
    isRegistering.value = true
}

const showLogin = () => {
    isRegistering.value = false
}

</script>

<template>
    <div class= "bg-slate-800 text-slate-200 p-8 m-w-[500px] w-1/3 h-auto m-auto rounded-xl drop-shadow-2xl shadow-md">
        <h1 class = "text-4xl mb-5 text-center border-b-2 border-b-slate-700 pb-4" v-if="!isRegistering">Login</h1>
        <h1 class = "text-4xl mb-5 text-center border-b-2 border-b-slate-700 pb-4" v-if="isRegistering">Register</h1>
        <form @submit.prevent="isRegistering ? registerUser() : attemptLogin()">
            <div class = "flex w-full gap-3 mb-3 flex-wrap">
                <input title = "Your email address- this will not be visible publicly" class = "grow rounded p-2 text-slate-800 active:ring-2 active:ring-sky-300 caret-sky-600 focus:ring-3 focus:ring-sky-300 accent-sky-300" type="text" v-model="username" placeholder="Email">
                <input title = "A secure password" class = "grow rounded p-2 text-slate-800 active:ring-2 active:ring-sky-300 caret-sky-600 focus:ring-3 focus:ring-sky-300 accent-sky-300" type="password" v-model="password" placeholder="Password">
                <input title = "The name or username that will be publicly visible" class = "grow rounded p-2 text-slate-800 active:ring-2 active:ring-sky-300 caret-sky-600 focus:ring-3 focus:ring-sky-300 accent-sky-300" v-if="isRegistering" type="text" v-model="displayName" placeholder="Display Name">
                <button class="cursor-pointer bg-cyan-600 px-5 py-2 rounded shadow-slate-900 text-slate-200 hover:bg-cyan-700 hover:scale-105 transition-all duration-300 grow" type="submit">{{ isRegistering ? 'Sign up' : 'Login' }}</button>
            </div>
            
            <p class="text-sm italic text-slate-400" v-if="!isRegistering">Don't have an account? <button class="hover:text-white transition-all duration-300" @click="showRegister">Sign up</button></p>
            <p class="text-sm italic text-slate-400" v-if="isRegistering">Already have an account? <button class="hover:text-white transition-all duration-300" @click="showLogin">Login</button></p>
        </form>
    </div>
</template>