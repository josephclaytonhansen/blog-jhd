<script setup>
import ThreeSquareImage from '../images/threesquareImage.vue'
import { ref } from 'vue'
const post = ref({})
const props = defineProps({
    post: Object,
    overlay: {type: Boolean, default: true},
})
const author = ref('')
import getAuthor from '../../functions/getAuthor.js'
import { onBeforeMount } from 'vue'

onBeforeMount(async () => {
        await getAuthor(props.post.author).then((data) => {
            author.value = data
            console.log(data)
        })
    })
post.value = props.post
</script>

<template>
    <div class="relative w-screen overflow-hidden">
        <ThreeSquareImage :image="props.post.featuredImage" :alt="props.post.title" class="w-screen overflow-hidden" :rounded="false" />
        <div class="absolute inset-0 bg-black opacity-30 rounded"></div>
        <div class="absolute w-full translate-y-full h-full flex flex-col justify-center items-center" style="z-index:999">
            <h1 class="text-4xl font-header text-white max-w-[80%]">{{props.post.title}}</h1>
            <div class="flex gap-2 items-center">
                <h2 class="font-header italic text-gray-200">Written by {{author.displayName}}</h2>
                <hr class="dividing-line-mid"/>
                <h2 class="text-xs font-header italic text-gray-200">{{props.post.category}}</h2>
            </div>
        </div>
    </div>
</template>