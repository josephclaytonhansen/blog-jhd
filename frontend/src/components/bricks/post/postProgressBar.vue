<script setup>

import { ref, onMounted } from 'vue'


const progressBar = ref(0)

const scrollHandler = () => {
    const winScroll = document.documentElement.scrollTop || document.body.scrollTop
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const scrolled = (winScroll / height) * 100
    progressBar.value = scrolled
}

onMounted(() => {
    window.addEventListener('scroll', scrollHandler)
})

</script>

<template>
    <div id="progress-bar" class="fixed top-0 left-0 w-screen overflow-hidden bg-backdrop-1 transition-opacity duration-300 h-2 border-b-2 border-top-2 border-backdrop-1 z-50 :class="progressBar > 2 ? 'opacity-100' : 'opacity-0'" >
        <div id="progress-bar-fill" class="h-full absolute rounded-r-md left-0 top-0 bg-accent-500 transition-opacity duration-300":style="{ width: progressBar + '%' }" :class="progressBar > 2 ? 'opacity-100' : 'opacity-0'"></div>
    </div>
</template>