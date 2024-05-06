<script setup>
const props = defineProps({
    logo: String,
})
</script>

<template>
    <router-link :to="{ name: 'home' }">
        <div class="square-img-container">
            <img :src="logo" :alt="window.location.hostname" class="square-img" />
        </div>
    </router-link>
</template>