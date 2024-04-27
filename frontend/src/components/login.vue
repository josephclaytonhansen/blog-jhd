<script setup>
import {userStore} from "../userStore"
import {pinia} from '../main.js'
</script>

<template>
    <div>
        <h1>Login</h1>
        <form @submit.prevent="login">
            <input type="text" v-model="username" placeholder="Username">
            <input type="password" v-model="password" placeholder="Password">
            <button type="submit">Login</button>
        </form>
    </div>
</template>