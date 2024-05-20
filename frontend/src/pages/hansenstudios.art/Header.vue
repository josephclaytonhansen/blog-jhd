<script setup>

import { ref, onMounted } from 'vue'

const loggedIn = ref(false)

onMounted(() => {
    if (localStorage.getItem('token')) {
        loggedIn.value = true
    }
})

</script>

<template></template>