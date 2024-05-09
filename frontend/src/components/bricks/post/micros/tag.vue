<script setup>
import { ref } from 'vue'
const tagD = ref('')
const props = defineProps({
    tag: String
})
tagD.value = props.tag
</script>

<template>
    <div class="colorblock_accent px-3 py-2 text-sm rounded-lg italic pointer-cursor w-min">
        <p class="text-text-3">{{tagD}}</p>
    </div>
</template>