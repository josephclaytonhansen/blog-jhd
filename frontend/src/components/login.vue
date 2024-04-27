<script setup>
import {userStore} from "../userStore"
import {pinia} from '../main.js'
import { useToast } from "vue-toastification"
const toast = useToast()
import axios from 'axios'
import { ref } from 'vue'

const username = ref('')
const password = ref('')

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
            'Access-Control-Allow-Origin': '*'
            } 
        }  
    let url = 'http://localhost:3720/user/login'
    try{
    axios.post(url, params, config)
    .then((response) => {
        toast.success('Login successful')
        if (response.data) {
            store.login(response.data)
            setTimeout(() => {
                window.location.href = '/'
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

</script>

<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="attemptLogin">
            <input type="text" v-model="username" placeholder="Username">
            <input type="password" v-model="password" placeholder="Password">
            <button type="submit">Login</button>
        </form>
    </div>
</template>