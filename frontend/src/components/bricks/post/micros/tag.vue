<script setup>
import { ref } from 'vue'
const tagD = ref('')
const props = defineProps({
    tag: String
})
tagD.value = props.tag
</script>

<template>
    <div class="colorblock_accent px-1 text-sm rounded-lg italic cursor-pointer hover:bg-accent-500 duration-300 transition-all w-min">
        <p>{{tagD}}</p>
    </div>
</template>