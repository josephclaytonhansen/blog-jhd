<script setup>
const site = window.location.protocol + '//' + window.location.host
import JhdHome from './blog.josephhansen.dev/Home.vue'
import HsaHome from './hansenstudios.art/Home.vue'
</script>

<template>
    <div>
        <JhdHome v-if="site === 'https://blog.josephhansen.dev'"/>
        <HsaHome v-else-if="site === 'https://hansenstudios.art'"/>
    </div>
</template>