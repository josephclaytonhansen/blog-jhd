<script setup>
import HdImage from '../images/hdImage.vue'
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
    if (props.overlay === false){
        author.value = await getAuthor(props.post.author)
    }
    })
post.value = props.post
</script>

<template>
    <div class="relative rounded" v-if="overlay===true">
        <HdImage :image="props.post.featuredImage" :alt="props.post.title" class="w-full rounded" />
        <div class="absolute inset-0 bg-black opacity-30 rounded"></div>
        <h1 class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-header text-white max-w-[80%]">{{props.post.title}}</h1>
    </div>
    <div class="w-full flex flex-col gap-2 rounded" v-else>
        <HdImage :image="props.post.featuredImage" :alt="props.post.title" class="w-full rounded" />
        <h1 class="text-4xl font-header">{{props.post.title}}</h1>
        <h2 class="text-xs font-header italic">{{author.displayName}}</h2>
    </div>
    <hr class="dividing-line"/>
</template>