<script setup>
import {pinia} from '../../main.js'
import {userStore} from "../../userStore.js"

import { onMounted, ref } from 'vue'

const loggedInStatus = ref(false)

const store = userStore(pinia)

const posts = ref([])

const getPosts = async () => {
  const response = await fetch('http://localhost:3720/blog/')
  if (!response.ok) {
    throw new Error('Network response was not ok.')
  }
  const data = await response.json()
  return data
}

onMounted(async () => {
  store.user ? loggedInStatus.value = true : loggedInStatus.value = false
  if (loggedInStatus.value){
    posts.value = await getPosts()
  }
  console.log(posts.value)
})

import {
    Eye,
    Trash,
    Check,
    CheckCheck,
    Clock,
    Pencil,
    MessageCircleMore,
    Tags,
    Router,
} from 'lucide-vue-next'

import { useToast } from "vue-toastification"
const toast = useToast()

import { useRouter } from 'vue-router'
const router = useRouter()

const viewPost = (id) => {
    router.push('/cms/posts/' + id)
}

const editPost = (id) => {
    router.push('/cms/posts/' + id + '/edit')
}

const deletePost = async (id) => {
    let url = 'http://localhost:3720/blog/' + id
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        await fetch(url, {
            method: 'DELETE',
            headers: config.headers,
            credentials: 'include'
        })
        toast.success('Post deleted')
        posts.value = getPosts()
    } catch (error) {
        toast.error(error.message || error.error || 'Error deleting post')
    }
}

const publishPost = async (id) => {
    let url = 'http://localhost:3720/blog/publish' + id
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        await fetch(url, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include'
        })
        toast.success('Post published')
        posts.value = getPosts()
    } catch (error) {
        toast.error(error.message || error.error || 'Error publishing post')
    }
}

const unpublishPost = async (id) => {
    let url = 'http://localhost:3720/blog/unpublish/' + id
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
        },
        withCredentials: true
    }
    try {
        await fetch(url, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include'
        })
        toast.success('Post unpublished')
        posts.value = getPosts()
    } catch (error) {
        toast.error(error.message || error.error || 'Error unpublishing post')
    }
}

</script>

<template>
    <div class="p-3 rounded-xl">
        <table class='w-full text-slate-400 table-auto border-separate border-spacing-0 min-w-[700px] scale-[60%] sm:scale-[80%] md:scale-100 -translate-x-[21%] sm:-translate-x-[10%] md:translate-x-0 -translate-y-4 sm:translate-y-0'>
            <colgroup>
                <col style="width: 4%"/>
                <col style="width: 4%"/>
                <col style="width: 25%"/>
                <col style="width: 14%"/>
                <col style="width: 14%"/>
                <col style="width: 14%"/>
                <col style="width: 8%"/>
                <col style="width: 5%"/>
                <col style="width: 7%"/>
            </colgroup>
            <thead class="bg-slate-700 text-center">
                <tr>
                    <th class="p-3"><div class=  "flex items-center justify-center w-8 h-8"><Eye/></div></th>
                    <th class=" p-3"><div class = "flex items-center justify-center  w-8 h-8"><MessageCircleMore/></div></th>
                    <th class=" p-3">Title</th>
                    <th class=" p-3">Author</th>
                    <th class="hidden sm:table-cell p-3"><div class = "flex items-center justify-center m-auto w-8 h-8"><Router/></div></th>
                    <th class="hidden sm:table-cell p-3"><div class = "flex items-center justify-center m-auto w-8 h-8"><Tags/></div></th>
                    <th class="hidden sm:table-cell p-3">Category</th>
                    <th class=" p-3">Status</th>
                    <th class="p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in posts" :key="post._id" class = "text-center">
                    <td class="py-2 border-b-slate-800 border-b-2 text-center">{{post.views}}</td>
                    <td class = "border-b-slate-800 border-b-2 text-center">{{ post.comments.length }}</td>
                    <td class="cursor-pointer hover:text-white transition-all duration-300 border-b-slate-800 border-b-2 text-center"><a :href="post.site + '/' + post.slug">{{post.title}}</a></td>
                    <td class = "border-b-slate-800 border-b-2 text-center">{{post.author}}</td>
                    <td class="hidden sm:table-cell border-b-slate-800 border-b-2 text-center">{{post.site}}</td>
                    <td class="hidden sm:table-cell border-b-slate-800 border-b-2 text-center">{{post.tags.join(', ')}}</td>
                    <td class="hidden sm:table-cell border-b-slate-800 border-b-2 text-center">{{post.category}}</td>
                    <td class=" border-b-slate-800 border-b-2 text-center">
                        <div v-if="post.status == 'published'" class="cursor-pointer hover:text-white transition-all duration-300 flex items-center justify-center" @click="unpublishPost(post._id)">
                            <CheckCheck  />
                        </div>
                        <div v-else-if="post.status == 'scheduled'">
                            <Clock />
                        </div>
                        <div v-else @click="publishPost(post._id)" class="cursor-pointer hover:text-white transition-all duration-300">
                            <Check  />
                        </div>
                    </td>
                    <td class=" border-b-slate-800 border-b-2">
                        <div class='flex justify-center items-center m-auto'>
                            <div class='cursor-pointer hover:text-white transition-all duration-300' @click="viewPost(post._id)"><Eye /></div>
                            <div class='cursor-pointer hover:text-white transition-all duration-300 px-2' @click="editPost(post._id)"><Pencil /></div>
                            <div class='cursor-pointer hover:text-white transition-all duration-300' @click="deletePost(post._id)"><Trash /></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
tr:nth-child(even) {
    background-color: unset;
}

</style>