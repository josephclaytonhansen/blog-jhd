<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const thisUser = ref({})
import Avatar from '../components/bricks/images/avatar.vue'

import {
    PenLine,
    AsteriskSquare,
    Check,
    X,
    Eye,
    Pen,
    Home,
    
} from 'lucide-vue-next'

onMounted( async() => {
    let user = JSON.parse(localStorage.getItem('user')).user
    let user_id = user._id
    if (user_id) {
        let url = `${process.env.VUE_APP_SERVER_URL}/user/id/` + user_id
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        try {
            await fetch(url, {
                method: 'GET',
                headers: config.headers,
                credentials: 'include',
            }).then(async (response) => {
                if (response.status !== 200) {
                    throw new Error('Network error- could not get user')
                }
                thisUser.value = await response.json()
            }).catch((error) => {
                throw new Error(error.message || error.error || 'Error getting user')
                router.push('/login')
            })
        } catch (error) {
            throw new Error(error.message || error.error || 'Error getting user')
            router.push('/login')
        }
    } else {
        router.push('/login')
    }
})
</script>

<template>
    <div class="flex bg-backdrop-3 h-[100vh] overflow-hidden w-full p-3 lg:p-0">
        <div class= "bg-backdrop-2 text-text-0 p-8 m-w-[500px] w-full lg:w-1/2 h-auto m-auto rounded-xl  ">
            <h1 class="text-4xl font-normal text-left  ">Profile<PenLine class="ml-2 h-full w-auto text-accent-500 hover:cursor-pointer hover:text-accent-300 transition-all duration-300 inline-block"/></h1>
            <hr class="border-backdrop-1 my-4">
            <div class="flex flex-row items-stretch gap-12 justify-start h-auto flex-wrap">
                <div class="flex items-center gap-2 shrink flex-wrap max-w-[50%] ">
                    <Avatar :image="thisUser.picture" classes="ring-4 mr-2 ring-accent-500 hover:cursor-pointer hover:ring-accent-300 square-img-container transition-all duration-300  w-[10vw]" alt="avatar"/>
                    <div class="max-w-[100%] flex flex-col gap-2 border-r-2 pr-5 border-backdrop-1">
                        <h3 class="text-2xl">{{thisUser.displayName}}</h3>
                        <h4 class="text-md italic text-text-1">{{thisUser.shortBio}}</h4>
                        <h5 class="text-md italic text-text-2">{{thisUser.email}}
                            <Check v-if="thisUser.verifiedEmail" class="h-4 w-4 text-green-500 inline-block"/>
                            <X v-else class="h-4 w-4 text-red-500 inline-block"/>
                        </h5>
                        <h5 class="text-md italic text-text-2">{{thisUser.website}}</h5>
                    </div>
                </div>
                <div class="flex flex-row items-start justify-start grow">
                    <p class="text-lg text-text-1">{{thisUser.longBio}}</p>
                </div>
            </div>

            <hr class="border-backdrop-1 my-4">
            <div class="flex flex-row items-center gap-4 justify-start h-auto flex-wrap">
                <div class="flex flex-col gap-2">
                    <h3 class="text-2xl">Posts</h3>
                    <div class="flex flex-row items-center gap-2 justify-start h-auto flex-wrap">
                        <div v-for="post in thisUser.posts" class="flex flex-col gap-2">
                            <h4 class="text-lg">{{post.title}}</h4>
                            <div class="flex items-center gap-2 justify-start h-auto flex-wrap">
                                <div><Eye/><p class="text-md text-text-1">{{post.views}}</p></div>
                                <PenLine/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="border-backdrop-1 my-4">
            <div class="flex flex-row items-center gap-4 justify-start h-auto flex-wrap">
                <div class="flex flex-col gap-2">
                    <h3 class="text-2xl">Comments</h3>
                    <div class="flex flex-row items-center gap-2 justify-start h-auto flex-wrap">
                        <div v-for="comment in thisUser.comments" class="flex flex-col gap-2">
                            <h4 class="text-lg">{{comment.text}}</h4>
                            <div class="flex items-center gap-2 justify-start h-auto flex-wrap">
                                <PenLine/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="fixed bottom-0 right-0 p-4">
                <AsteriskSquare class="h-8 w-8 text-text-1 hover:cursor-pointer hover:text-accent-300 transition-all duration-300"/>
            </div>
            
        </div>
        <div class="fixed top-0 left-0 p-4" @click="router.push('/')">
            <Home class="w-10 h-10 cursor-pointer bg-accent-500 p-2 rounded-lg   text-text-0 hover:bg-accent-600 hover:scale-105 transition-all duration-300"/>
        </div>
    </div>
</template>