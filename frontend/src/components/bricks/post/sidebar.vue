<script setup>
import authorBox from './authorBox.vue'
const props = defineProps({
    author: String
})
</script>

<template>
    <div class="sidebar grow max-w-[30vw] hidden md:hidden lg:flex flex-col p-5 rounded-xl">
        <authorBox :author_id="props.author" class="hidden lg:block" />
    </div>
</template>