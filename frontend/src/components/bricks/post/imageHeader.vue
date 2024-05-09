<script setup>
import HdImage from './hdImage.vue'
import { ref } from 'vue'
const props = defineProps({
    src: String,
    title: String,
    overlay: {type: Boolean, default: true},
    author: String,
})
</script>

<template>
    <div class="relative" v-if="overlay===true">
        <HdImage :image="props.src" :alt="props.title" class="w-full rounded" />
        <div class="absolute inset-0 bg-black opacity-30"></div>
        <h1 class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-header text-white max-w-[80%]">{{props.title}}</h1>
    </div>
    <div class="w-full flex flex-col gap-2" v-else>
        <HdImage :image="props.src" :alt="props.title" class="w-full rounded" />
        <h1 class="text-4xl font-header">{{props.title}}</h1>
        <h2 class="text-xs font-header italic">{{props.author}}</h2>
    </div>
    <hr class="dividing-line"/>
</template>