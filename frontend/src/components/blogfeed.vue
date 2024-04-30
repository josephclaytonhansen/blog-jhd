<script setup>
    import { onMounted, ref } from 'vue'
    const posts = ref([])

    import {useRouter} from 'vue-router'
    const router = useRouter()

    const site = window.location.protocol + '//' + window.location.host
    
    const getPosts = async () => {
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/blog/`)
        if (!response.ok) {
            toast.error('Network error- could not get posts')
            throw new Error('Network response was not ok.')
        }
        const data = await response.json()
        return filterPostsToSite(data)
    }
    onMounted(async () => {
        if (localStorage.getItem('posts')) {
        posts.value = JSON.parse(localStorage.getItem('posts'))
        let temp = await getPosts()
        if (JSON.stringify(posts.value) !== JSON.stringify(temp)) {
            posts.value = temp
            localStorage.setItem('posts', JSON.stringify(posts.value))
        }
    } else {
        posts.value = await getPosts()
        localStorage.setItem('posts', JSON.stringify(posts.value))
    }
    })

    const filterPostsToSite = (posts) => {
        return posts.filter(post => post.site === site)
    }
</script>

<template>
    <div>
        <h1>Blog Feed</h1>
        <div v-for="post in posts" :key="post.id">
            <h2>{{ post.title }}</h2>
        </div>
    </div>

</template>