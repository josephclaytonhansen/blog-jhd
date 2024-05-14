<script setup>
import { useHead } from '@vueuse/head'

useHead({
    title: 'SEABASS Test',
    meta: [
        {
            name: 'description',
            content: 'This is a test page for the SEABASS framework'
        },
        {
            name: 'robots',
            content: 'noindex, nofollow'
        }
    ]
})
</script>

<template>
    <h1>This site is running on SEABASS</h1>
</template>