<script setup>
import {pinia} from '../../main.js'
import {userStore} from "../../userStore.js"

import { onMounted, ref } from 'vue'

const loggedInStatus = ref(false)

const store = userStore(pinia)

const posts = ref([])

const getPosts = async () => {
  const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/blog/`)
  if (response.status !== 200) {
    toast.error('Network error')
    throw new Error('Network error- could not get posts')
  }
  const data = await response.json()
  return data
}

onMounted(async () => {
  store.user ? loggedInStatus.value = true : loggedInStatus.value = false
  if (loggedInStatus.value){
    

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

    
  } else {
    toast.info('Your session has expired. Please log in.')
    router.push('/login')
  }
})

import {
    Eye,
    Trash,
    Send,
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

}

const editPost = (id) => {

}

const deletePost = async (id) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/delete/` + id
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
            method: 'DELETE',
            headers: config.headers,
            credentials: 'include',
        }).then(async (response) => {
            if (response.status !== 200) {
                toast.error('Error deleting post')
                posts.value = getPosts()
                throw new Error('Network error- could not delete post')
            }
            toast.success('Post deleted')
            posts.value = await getPosts()
        }).catch((error) => {
            toast.error(error.message || error.error || 'Error deleting post')
        })
        
    } catch (error) {
        toast.error(error.message || error.error || 'Error deleting post')
    }
}

const publishPost = async (id) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/publish/` + id
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
            method: 'POST',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200) {
                throw new Error('Network error- could not publish post')
            }
            toast.success('Post published')
            posts.value = await getPosts()
        }).catch(async (error) => {
            toast.error(error.message || error.error || 'Error publishing post')
        })
    } catch (error) {
        toast.error(error.message || error.error || 'Error publishing post')
    }
}

const newPost = () => {
    router.push('/cms/posts/new')
}

const unpublishPost = async (id) => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/unpublish/` + id
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
            method: 'POST',
            headers: config.headers,
            credentials: 'include'
        }).then(async (response) => {
            if (response.status !== 200) {
                throw new Error('Network error- could not unpublish post')
            }
            toast.success('Post unpublished')
            posts.value = await getPosts()
        }).catch((error) => {
            toast.error(error.message || error.error || 'Error unpublishing post')
        })
    } catch (error) {
        toast.error(error.message || error.error || 'Error unpublishing post')
    }
}

</script>

<template>
    <div class="p-3">
        <table class='w-full text-slate-400 table-auto border-separate border-spacing-0 min-w-[700px] scale-[60%] sm:scale-[80%] md:scale-100 -translate-x-[21%] sm:-translate-x-[10%] md:translate-x-0 -translate-y-4 sm:translate-y-0'>
            <colgroup>
                <col style="width: 3%"/>
                <col style="width: 3%"/>
                <col style="width: 25%"/>
                <col style="width: 14%"/>
                <col style="width: 16%"/>
                <col style="width: 14%"/>
                <col style="width: 8%"/>
                <col style="width: 5%"/>
                <col style="width: 7%"/>
            </colgroup>
            <thead class="bg-slate-700 text-center uppercase">
                <tr>
                    <th class="p-3"><div class=  "flex items-center justify-center w-8 h-8"><Eye/></div></th>
                    <th class=" p-3"><div class = "flex items-center justify-center w-8 h-8"><MessageCircleMore/></div></th>
                    <th class="font-normal p-3">Title</th>
                    <th class="font-normal p-3">Author</th>
                    <th class="hidden sm:table-cell p-3"><div class = "flex items-center justify-center m-auto w-8 h-8"><Router/></div></th>
                    <th class="hidden sm:table-cell p-3"><div class = "flex items-center justify-center m-auto w-8 h-8"><Tags/></div></th>
                    <th class="hidden sm:table-cell p-3 font-normal">Category</th>
                    <th class="font-normal p-3">Status</th>
                    <th class="font-normal p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in posts" :key="post._id" class = "text-center bg-slate-800">
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
                        <div v-else @click="publishPost(post._id)" class="cursor-pointer hover:text-white transition-all duration-300 flex items-center justify-center">
                            <Send  />
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
    <div @click="newPost" class = "fixed z-50 md:bottom-5 md:right-5 scale-50 sm:scale-75 md:scale-100 bottom-1 right-0 cursor-pointer bg-cyan-600 px-5 py-2 rounded-lg shadow-md shadow-slate-900 text-slate-200 hover:bg-cyan-700 hover:scale-105 transition-all duration-300">New post
    </div>
</template>

<style scoped>
tr:nth-child(even) {
    background-color: unset;
}

</style>