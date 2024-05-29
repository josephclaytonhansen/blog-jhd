<script setup>
import { ref, onBeforeMount } from 'vue'

const props = defineProps({
  content: Object
})

const sanitizedContent = ref('')

import sanitizeHtml from 'sanitize-html'

const sanitize = (dirty) => sanitizeHtml(dirty, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
    allowedAttributes: {
        a: [ 'href', 'name', 'target' ],
        img: [ 'src', 'srcset', 'alt', 'title', 'width', 'height', 'loading' ],
        '*': [ 'style' ],
        video: [ 'src', 'controls', 'autoplay', 'muted', 'loop', 'poster', 'preload', 'width', 'height' ],
    },
    parser: {
    lowerCaseTags: false,
    lowerCaseAttributeNames: false
    }
    })

onBeforeMount(() => {
    sanitizedContent.value = sanitize(props.content)
})
</script>

<template>
    <div v-html="sanitizedContent" class="prose grow text-text-1 max-w-[80vw]"></div>
</template>