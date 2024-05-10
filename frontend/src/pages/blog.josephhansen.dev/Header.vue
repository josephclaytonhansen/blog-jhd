<script setup>
import {User, Terminal} from 'lucide-vue-next'
import {useRouter} from 'vue-router'
const router = useRouter()
import {ref, onMounted} from 'vue'

const loggedIn = ref(false)

onMounted(() => {
    if (localStorage.getItem('token')) {
        loggedIn.value = true
    }
})

</script>

<template>
    <header class="w-screen overflow-hidden colorblock_dark p-5">
        <nav class="flex justify-between items-center">
            <div class="flex items-center">
                <Terminal class="text-accent-500 w-8 h-8"/>
                <a href="josephhansen.dev" class="text-accent-500 cursor-pointer">josephhansen.dev</a>
            </div>
            <div class="flex items-center">
                <router-link to="/blog" class="text-text-0 cursor-pointer">Blog</router-link>
            </div>
            <div class="flex items-center">
                <router-link to="/login" v-if="!loggedIn" class="text-text-0 cursor-pointer"><User/>Login</router-link>
                <router-link to="/me" v-if="loggedIn" class="text-text-0 cursor-pointer"><User/>Me</router-link>
            </div>
        </nav>
    </header>
</template>