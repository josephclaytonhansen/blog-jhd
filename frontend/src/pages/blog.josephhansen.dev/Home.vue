
<script setup>

import { ref, onMounted } from 'vue'
import hdImage from '../../components/bricks/images/hdImage.vue'

import axios from 'axios'

const site = window.location.hostname
const recentPosts = ref([])
let startIndex = 0
const count = 5

const trimExcerpt = (excerpt) => {
    if (excerpt.length > 300) {return excerpt.substring(0, 300) + '...'} else {return excerpt}}

const getNRecentPostsStartingAt = (startIndex, count) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/posts/recent`
    let params = {
        site: site,
        startIndex: startIndex,
        count: count
    }
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token') || '',
            },
            withCredentials: true,
    }

    axios.post(url, params, config).then((response) => {
        response.data.forEach((newPost) => {
            if (!recentPosts.value.some((post) => post.id === newPost.id)) {
                recentPosts.value.push(newPost)
            }
        })
    }).catch((error) => {
        console.log(error)
    })
}

const readMore = () => {
    startIndex += count
    getNRecentPostsStartingAt(startIndex, count)
}

onMounted(() => {
    getNRecentPostsStartingAt(startIndex, count)
})

const postLink = (post) => {
    if (post.location === '' || post.location === undefined || post.location === "/") {
        return '/p/' + post.slug
    } else {
        return '/p/' + post.location + '/' + post.slug
    }
}

</script>



<template>
    <div class="p-5 w-full text-text-1">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-5">
            <div>
                <h1 class="text-3xl font-header">Recent posts</h1>
                <div class="flex flex-wrap gap-3">
                    <div v-for="post in recentPosts" :key="post.id" class="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 colorblock rounded" v-if="recentPosts">
                        <router-link :to="postLink(post)">
                        <hdImage :image="post.featuredImage" :alt="post.title"/>
                        <div class="p-3 flex flex-col items-center align-middle">
                            <h3 class="font-header text-lg text-center">{{ post.title }}</h3>
                            <p class="text-text-2" >{{ trimExcerpt(post.excerpt) }}</p>
                        </div> 
                        </router-link>
                    </div>
                </div>
                <button class="cursor-pointer bg-accent-500 px-5 py-2 rounded  text-text-0 hover:bg-accent-600 hover:scale-105 transition-all duration-300 grow" @click="readMore">Read more</button>
            </div>

            <div>

            </div>
        </div>
        
    </div>
</template>