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
    <div>
        <h1>Login</h1>
        <form @submit.prevent="isRegistering ? registerUser() : attemptLogin()">
            <input type="text" v-model="username" placeholder="Email">
            <input type="password" v-model="password" placeholder="Password">
            
            <input v-if="isRegistering" type="text" v-model="displayName" placeholder="Display Name">
                
            <button type="submit">{{ isRegistering ? 'Sign up' : 'Login' }}</button>
            <p v-if="!isRegistering">Don't have an account? <button @click="showRegister">Sign up</button></p>
            <p v-if="isRegistering">Already have an account? <button @click="showLogin">Login</button></p>
        </form>
    </div>
</template>