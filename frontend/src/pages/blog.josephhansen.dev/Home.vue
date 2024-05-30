
<script setup>

import { ref, onMounted } from 'vue'
import hdImage from '../../components/bricks/images/hdImage.vue'

import Header from '../../components/bricks/sitewide/Header.vue'
import Footer from '../../components/bricks/sitewide/Footer.vue'

import axios from 'axios'

const site = window.location.hostname
const recentPosts = ref([])
let startIndex = 0
const count = 5

const trimExcerpt = (excerpt) => {
    if (excerpt.length > 300) {return excerpt.substring(0, 300) + '...'} else {return excerpt}}

const getNRecentPostsStartingAt = (startIndex, count) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/recent`
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
            if (!recentPosts.value.some((post) => post._id === newPost._id)) {
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
    <Header :thisPageComponentName="'Header'" />
    <div class="p-8 w-full min-h-screen text-text-1 bg-backdrop-1">
        <h1 class="text-5xl font-header pb-3">Joseph Hansen's development blog and other musings</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-5">
            <div>
                <h2 class="text-3xl font-header pb-3">Recent posts</h2>
                <div class="flex flex-wrap flex-col gap-3">
                    <div v-for="post in recentPosts" :key="post._id" class="w-full colorblock rounded">
                        <router-link :to="postLink(post)">
                        <hdImage :image="post.featuredImage" :alt="post.title"/>
                        <div class="p-3 flex flex-col items-center align-middle">
                            <h3 class="font-header text-lg text-center">{{ post.title }}</h3>
                            <p class="text-text-2" >{{ trimExcerpt(post.excerpt) }}</p>
                        </div> 
                        </router-link>
                    </div>
                </div>
                <button class="cursor-pointer bg-accent-500 px-5 py-2 rounded mt-3 w-full text-text-0 hover:bg-accent-600 hover:scale-105 transition-all duration-300 grow" @click="readMore">Read more</button>
            </div>

            <div>
                <h2 class="text-3xl font-header pb-3">Other sites</h2>
                <h3 class="text-2xl font-header pb-3">My sites</h3>
                <div class="flex flex-wrap flex-col gap-3">
                    <a href="https://josephhansen.dev" class="w-full colorblock rounded p-2">
                        <h4 class="font-header text-lg text-center">josephhansen.dev</h4>
                        <p class="text-text-2" >Web portfolio and services</p>
                    </a>
                    <a href="https://hansenstudios.art" class="w-full colorblock rounded p-2">
                        <h4 class="font-header text-lg text-center">hansenstudios.art</h4>
                        <p class="text-text-2">My studio's art, animation, and other works</p>
                    </a>
                    <a href="https://github.com/josephclaytonhansen" class="w-full colorblock rounded p-2">
                        <h4 class="font-header text-lg text-center">github.com/josephclaytonhansen</h4>
                        <p class="text-text-2" >GitHub</p>
                    </a>
                </div>
                <h3 class="text-2xl font-header pb-3">Blogs I recommend</h3>
                <div class="flex flex-wrap flex-col gap-3">
                    <a href="https://mattdugan.com" class="w-full colorblock rounded p-2">
                        <h4 class="font-header text-lg text-center">mattdugan.com</h4>
                        <p class="text-text-2" >An insightful and entertaining developer blog I'm a fan of</p>
                    </a>
                    <a href="https://blog.jgc.org" class="w-full colorblock rounded p-2">
                        <h4 class="font-header text-lg text-center">blog.jgc.org</h4>
                        <p class="text-text-2" >John Graham-Cumming's blog; a lot of his retro computing stuff goes over my head, but it's all fascinating</p>
                    </a>
                </div>
            </div>
            <div>
                <div class="rounded colorblock p-2">
                    <h2 class="text-3xl font-header pb-3">Since you're here, try:</h2>
                    <p class="text-text-2">
                        Thanks for checking out my blog! My goal in life is to make the world a better place, and I hope I can inspire you to do the same. Consider donating to Ukraine or Gaza, going to a local city council meeting, planting pollinator flowers, or commiting a bug fix to an open source project :)
                    </p>
                </div>
            </div>
        </div>
        
    </div>
    <Footer :thisPageComponentName="'Footer'" />
</template>