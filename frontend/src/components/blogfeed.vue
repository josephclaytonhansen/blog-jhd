<script setup>
    import { onMounted, ref } from 'vue'
    const posts = ref([])
    const getPosts = async () => {
        const response = await fetch('http://localhost:3720/blog/')
        if (!response.ok) {
            toast.error('Network error- could not get posts')
            throw new Error('Network response was not ok.')
        }
        const data = await response.json()
        return data
    }
    onMounted(async () => {
        posts.value = await getPosts()
    })
</script>

<template>
    <div>
        <h1>Blog Feed</h1>
        <div v-for="post in posts" :key="post.id">
            <h2>{{ post.title }}</h2>
        </div>
    </div>

</template>