
<script setup>

import { ref, onMounted } from 'vue'
import FourSquareImage from '../../components/bricks/images/foursquareImage.vue'

import Header from '../../components/bricks/sitewide/Header.vue'
import Footer from '../../components/bricks/sitewide/Footer.vue'

import axios from 'axios'

const site = window.location.hostname
const recentPosts = ref([])
let startIndex = 0
const count = 6

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
    <div class="px-16 w-full min-h-screen text-text-1 bg-backdrop-1">
        <h1 class="text-xl lg:text-4xl pt-5 pb-16">Joseph Hansen's development blog and musings</h1>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-20">
            <div class="col-span-1 lg:col-span-2">
                <h2 class="text-lg lg:text-3xl pb-3">Recent posts</h2>
                <div class="flex flex-wrap gap-8">
                    <div v-for="post in recentPosts" :key="post._id" class="colorblock rounded grow max-w-full lg:max-w-[50%]">
                        <router-link :to="postLink(post)">
                        <FourSquareImage :image="post.featuredImage" :alt="post.title"/>
                        <div class="p-3 flex flex-col items-center align-middle">
                            <h3 class=" text-lg text-center">{{ post.title }}</h3>
                            <p class="text-text-2" >{{ trimExcerpt(post.excerpt) }}</p>
                        </div> 
                        </router-link>
                    </div>
                </div>
                <button class="cursor-pointer bg-accent-500 px-5 py-2 rounded mt-3 w-full text-text-0 hover:bg-accent-600 hover:scale-105 transition-all duration-300 grow" @click="readMore">Read more</button>
            </div>

            <div>
                <h2 class="text-lg lg:text-3xl  pb-3">Other sites</h2>
                <h3 class="text-lg lg:text-2xl  pb-3">My sites</h3>
                <div class="flex flex-wrap flex-col gap-3">
                    <div class="w-full colorblock rounded p-3 flex justify-start align-middle">
                        <a href="https://josephhansen.dev"><h4 class=" text-lg text-center">josephhansen.dev</h4></a>
                        <p class="text-text-2" >Web portfolio and services</p>
                    </div>
                    <div class="w-full colorblock rounded p-3 flex justify-start align-middle">
                        <a href="https://hansenstudios.art"><h4 class=" text-lg text-center">hansenstudios.art</h4></a>
                        <p class="text-text-2">My studio's art, animation, and other works</p>
                    </div>
                    <div class="w-full colorblock rounded p-3 flex justify-start align-middle">
                        <a href = "https://github.com/josephclaytonhansen"><h4 class=" text-lg text-center">github.com/josephclaytonhansen</h4></a>
                        <p class="text-text-2" >GitHub</p>
                    </div>
                </div>
                <h3 class="text-lg lg:text-2xl  pb-3 pt-12">Blogs I recommend</h3>
                <div class="flex flex-wrap flex-col gap-3">
                    <div class="w-full colorblock rounded p-3 flex justify-start align-middle">
                        <a href = "https://mattdugan.com"><h4 class=" text-lg text-center">mattdugan.com</h4></a>
                        <p class="text-text-2" >An insightful and entertaining developer blog I'm a fan of</p>
                    </div>
                    <div class="w-full colorblock rounded p-3 flex justify-start align-middle">
                        <a href="https://blog.jgc.org"><h4 class=" text-lg text-center">blog.jgc.org</h4></a>
                        <p class="text-text-2" >John Graham-Cumming's blog; a lot of his retro computing stuff goes over my head, but it's all fascinating</p>
                    </div>
                </div>
            </div>
        </div>
        <div class = "mt-16">
            <div class="rounded colorblock p-3">
                <p class="text-text-2">
                    Thanks for checking out my blog! My goal in life is to make the world a better place, and I hope I can inspire you to do the same. Consider donating to Ukraine or Gaza, going to a local city council meeting, planting pollinator flowers, or commiting a bug fix to an open source project :)
                </p>
            </div>
        </div>
        
    </div>
    <Footer :thisPageComponentName="'Footer'" />
</template>

<style scoped>
a::after{
    display:none;
}
</style>