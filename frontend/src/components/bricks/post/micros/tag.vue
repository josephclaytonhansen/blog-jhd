<script setup>
import { ref } from 'vue'
const tag = ref('')
const props = defineProps({
    tag: String
})
tag.value = props.tag
</script>

<template>
    <div class="colorblock_accent px-3 py-2 text-sm rounded-lg italic pointer-cursor">
        <p class="text-text-3">{{tag}}</p>
    </div>
</template>