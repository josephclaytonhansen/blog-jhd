<script setup>
import {User, Terminal} from 'lucide-vue-next'
import {ref, onMounted} from 'vue'

const loggedIn = ref(false)

onMounted(() => {
    if (localStorage.getItem('token')) {
        loggedIn.value = true
    }
})

</script>

<template>
    <header class="w-screen overflow-hidden colorblock py-3 px-16 absolute border-b-2 border-backdrop-2" style = "z-index:999">
        <nav class="flex justify-between items-center">
            <div class="flex items-center flex-nowrap">
                <Terminal class="text-accent-500 w-8 h-8"/>
                <a href="https://josephhansen.dev" class="text-accent-500 cursor-pointer font-mono">josephhansen.dev</a>
            </div>
            <div class="flex items-center">
                <router-link to="/" class="text-text-0 cursor-pointer">Blog</router-link>
            </div>
            <div class="flex items-center flex-nowrap">
                <router-link to="/login" v-if="!loggedIn" class="text-text-0 cursor-pointer flex gap-2 items-center"><User/>Login</router-link>
                <router-link to="/me" v-if="loggedIn" class="text-text-0 cursor-pointer flex gap-2 items-center"><User/>Me</router-link>
            </div>
        </nav>
    </header>
</template>