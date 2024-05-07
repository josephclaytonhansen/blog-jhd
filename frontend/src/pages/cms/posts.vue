<script setup>
import {pinia} from '../../main.js'
import {userStore} from "../../userStore.js"

import { onMounted, ref } from 'vue'

import Editor from '../../components/cms/editor.vue'

const loggedInStatus = ref(false)

const store = userStore(pinia)

const posts = ref([])

const author = ref({})

const allSites = process.env.VUE_APP_FRONTEND_PREFIXES

const doing = ref('list')

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
    author.value = store.user
    let temp
    if (localStorage.getItem('posts')) {
      posts.value = JSON.parse(localStorage.getItem('posts'))
    }
    temp = await getPosts()
    if (!posts.value || JSON.stringify(posts.value) !== JSON.stringify(temp)) {
      posts.value = temp
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
    List,
    PenLine,
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
    doing.value = "new"
}

const listPost = () => {
    doing.value = "list"
}

const editingPostText = ref('')
const editingPostTitle = ref('')
const editingPostMetaTitle = ref('')
const editingPostMetaDescription = ref('')
const editingPostMetaKeywords = ref('')
const editingPostExcerpt = ref('')

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
    <Editor v-if="doing === 'new'"  :modelValue="editingPostText" @update:modelValue="editingPostText = $event"/>
    <div v-if="doing === 'new'">
        <h2 class="text-center text-2xl font-bold text-text-1">Metadata</h2>
        <form class = "flex gap-4 flex-wrap">
            <div class="flex flex-col gap-2">
                <label for="title" class="text-text-1">Title</label>
                <input type="text" name="title" class="grow rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300" v-model="editingPostTitle" placeholder="Title">>
            </div>
            <div class="flex flex-col gap-2">
                <label for="metaTitle" class="text-text-1">Meta Title</label>
                <input type="text" name="metaTitle" class="grow rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300" v-model="editingPostMetaTitle" placeholder="Meta Title">
            </div>
            <div class="flex flex-col gap-2">
                <label for="metaDescription" class="text-text-1">Meta Description</label>
                <textarea  name="metaDescription" class="grow rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300" v-model="editingPostMetaDescription" placeholder="Meta Description">
                </textarea>
            </div>
            <div class="flex flex-col gap-2">
                <label for="author" class="text-text-1">Author</label>
                <input readonly type="text" name="author" class="grow rounded p-2 bg-backdrop-1 text-text-0 " :value="author.displayName" placeholder="">
            </div>
            <div class="flex flex-col gap-2">
                <label for="site" class="text-text-1">Sites</label>
                <select multiple name="site" class="grow rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300">
                    <option v-for="site in allSites" :key="site" :value="site">{{site}}</option>
                </select>
            </div>


        </form>
    </div>
    <div class="p-3" v-else>
        <table class='w-full text-text-2 table-auto border-separate border-spacing-0 min-w-[700px] scale-[60%] sm:scale-[80%] md:scale-100 -translate-x-[21%] sm:-translate-x-[10%] md:translate-x-0 -translate-y-4 sm:translate-y-0'>
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
            <thead class="bg-backdrop-1 text-center uppercase">
                <tr>
                    <th class="p-3"><div class=  "flex items-center justify-center w-8 h-8"><Eye/></div></th>
                    <th class=" p-3"><div class="flex items-center justify-center w-8 h-8"><MessageCircleMore/></div></th>
                    <th class="font-normal p-3">Title</th>
                    <th class="font-normal p-3">Author</th>
                    <th class="hidden sm:table-cell p-3"><div class="flex items-center justify-center m-auto w-8 h-8"><Router/></div></th>
                    <th class="hidden sm:table-cell p-3"><div class="flex items-center justify-center m-auto w-8 h-8"><Tags/></div></th>
                    <th class="hidden sm:table-cell p-3 font-normal">Category</th>
                    <th class="font-normal p-3">Status</th>
                    <th class="font-normal p-3">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="post in posts" :key="post._id" class="text-center bg-backdrop-2">
                    <td class="py-2 border-b-backdrop-800 border-b-2 text-center">{{post.views}}</td>
                    <td class="border-b-backdrop-800 border-b-2 text-center">{{ post.comments.length }}</td>
                    <td class="cursor-pointer hover:text-text-0 transition-all duration-300 border-b-backdrop-800 border-b-2 text-center"><a :href="post.site + '/' + post.slug">{{post.title}}</a></td>
                    <td class="border-b-backdrop-800 border-b-2 text-center">{{post.author}}</td>
                    <td class="hidden sm:table-cell border-b-backdrop-800 border-b-2 text-center">{{post.site}}</td>
                    <td class="hidden sm:table-cell border-b-backdrop-800 border-b-2 text-center">{{post.tags.join(', ')}}</td>
                    <td class="hidden sm:table-cell border-b-backdrop-800 border-b-2 text-center">{{post.category}}</td>
                    <td class=" border-b-backdrop-800 border-b-2 text-center">
                        <div v-if="post.status == 'published'" class="cursor-pointer hover:text-text-0 transition-all duration-300 flex items-center justify-center" @click="unpublishPost(post._id)">
                            <CheckCheck  />
                        </div>
                        <div v-else-if="post.status == 'scheduled'">
                            <Clock />
                        </div>
                        <div v-else @click="publishPost(post._id)" class="cursor-pointer hover:text-text-0 transition-all duration-300 flex items-center justify-center">
                            <Send  />
                        </div>
                    </td>
                    <td class=" border-b-backdrop-800 border-b-2">
                        <div class='flex justify-center items-center m-auto'>
                            <div class='cursor-pointer hover:text-text-0 transition-all duration-300' @click="viewPost(post._id)"><Eye /></div>
                            <div class='cursor-pointer hover:text-text-0 transition-all duration-300 px-2' @click="editPost(post._id)"><Pencil /></div>
                            <div class='cursor-pointer hover:text-text-0 transition-all duration-300' @click="deletePost(post._id)"><Trash /></div>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div  class="fixed z-50 md:bottom-5 md:right-5 scale-50 sm:scale-75 md:scale-100 bottom-1 right-0 flex gap-4 ">
        <button @click="newPost" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg shadow-md shadow-backdrop-900 text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 flex items-center">
            <PenLine class = "pr-2"/>New post
        </button>
        <button @click="listPost" class="cursor-pointer bg-backdrop-0 px-5 py-2 rounded-lg shadow-md shadow-backdrop-900 text-text-0 hover:bg-backdrop-1 hover:scale-105 transition-all duration-300 flex items-center">
            <List class = "pr-2"/>List posts
        </button>
    </div>
</template>

<style scoped>
tr:nth-child(even) {
    background-color: unset;
}

</style>