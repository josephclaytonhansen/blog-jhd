<script setup>
import authorBox from '../components/bricks/post/authorBox.vue'
const props = defineProps({
    author: String
})
</script>

<template>
    <div class="sidebar grow max-w-72 hidden md:hidden lg:flex flex-col p-5 rounded-xl colorblock_accent">
        <authorBox :author_id="props.author" class="hidden lg:block" />
    </div>
</template>