<script setup>
import authorBox from './authorBox.vue'
import infoBox from './infoBox.vue'
const props = defineProps({
    post: Object,
})
</script>

<template>
    <div class="sidebar grow max-w-[30vw] hidden md:hidden lg:flex flex-col p-5 rounded-xl h-min">
        <authorBox :author_id="props.post.author" class="hidden lg:block" />
        <infoBox :views="props.post.views" :date="props.post.date" :tags="props.post.tags" :category="props.post.category" :comments="props.post.comments.length" :sidebar="true" />
    </div>
</template>