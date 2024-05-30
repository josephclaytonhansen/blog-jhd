<script setup>

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
    <div class = "w-full flex flex-col">
        <div class="flex justify-between items-center flex-wrap">
            <h1 class="text-4xl  font-semibold">{{props.post.title}}</h1>
            <h2 class="text-xs  italic grow">Written by {{author.displayName}}</h2>
            <hr class="dividing-line-mid"/>
            <div class="flex gap-2 items-center">
                <h2 class="text-xs  italic">{{props.post.category}}</h2>
                <Tags :tags="props.post.tags" class="ml-2" />
            </div>
        </div>
    </div>
</template>