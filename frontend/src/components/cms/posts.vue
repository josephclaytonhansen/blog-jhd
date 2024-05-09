<script setup>
import {pinia} from '../../main.js'
import {userStore} from "../../userStore.js"

import { onMounted, ref } from 'vue'

import Editor from '../../components/cms/editor.vue'

const loggedInStatus = ref(false)

const store = userStore(pinia)

const posts = ref([])
const tags = ref([])
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
  localStorage.setItem('posts', JSON.stringify(data))
  return data
}

const getTags = async () => {
  const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/tag/`)
  if (response.status !== 200) {
    toast.error('Network error')
    throw new Error('Network error- could not get tags')
  }
  const data = await response.json()
  return data
}

onMounted(async () => {
  store.user ? loggedInStatus.value = true : loggedInStatus.value = false
  if (loggedInStatus.value){
    tags.value = await getTags()
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
    NotepadText,
    Save,
} from 'lucide-vue-next'

import { useToast } from "vue-toastification"
const toast = useToast()

import { useRouter } from 'vue-router'
const router = useRouter()

const viewPost = (id) => {

}

const editPost = (id) => {
    doing.value = "editing"
    let temp = posts.value.filter(post => post._id === id)
    editingPostText.value = temp[0].content
    editingPostTitle.value = temp[0].title
    editingPostMetaTitle.value = temp[0].metaTitle
    editingPostMetaDescription.value = temp[0].metaDescription
    editingPostMetaKeywords.value = temp[0].metaKeywords
    editingPostExcerpt.value = temp[0].excerpt
    editingPostSites.value = temp[0].site
    editingPostFeaturedImage.value = temp[0].featuredImage
    editingPostLocation.value = temp[0].subDirectory
    editingPostStatus.value = temp[0].status
    editingPostId.value = temp[0]._id
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
    editingPostId.value = ''
    editingPostText.value = ''
    editingPostTitle.value = ''
    editingPostMetaTitle.value = ''
    editingPostMetaDescription.value = ''
    editingPostMetaKeywords.value = ''
    editingPostExcerpt.value = ''
    editingPostSites.value = ''
    editingPostFeaturedImage.value = ''
    editingPostLocation.value = ''
    editingPostStatus.value = 'new-draft'
    editingPostHeader.value = 'image'
    sidebar.value = true
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
const editingPostSites = ref('')
const editingPostFeaturedImage = ref('')
const editingPostLocation = ref('')
const editingPostStatus = ref('new-draft')
const editingPostId = ref('')
const editingPostTags = ref([])

const headerOptions = ref([
    'image',
    'noimage',
    'fullwidth'
])

const editingPostHeader = ref('image')

const sidebar = ref(true)

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

const saveNewDraft = async () => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/create`
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
    }

    let data = {
        title: editingPostTitle.value,
        content: editingPostText.value,
        metaTitle: editingPostMetaTitle.value,
        metaDescription: editingPostMetaDescription.value,
        metaKeywords: editingPostMetaKeywords.value,
        excerpt: editingPostExcerpt.value,
        site: editingPostSites.value,
        featuredImage: editingPostFeaturedImage.value,
        subDirectory: editingPostLocation.value,
        status: editingPostStatus.value,
        header: editingPostHeader.value,
        sidebar: sidebar.value,
        tags: editingPostTags.value
    }
    console.log(JSON.stringify(data))

    try {
        await fetch(url, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(async (response) => {
            if (response.status !== 201) {
                throw new Error('Network error- could not save draft')
            }
            toast.success('Draft saved')
            let temp = await response.json()
            editingPostId.value = temp._id
            editingPostStatus.value = 'draft'
            localStorage.setItem('posts', '')
            posts.value = await getPosts()
        }).catch((error) => {
            toast.error(error.message || error.error || 'Error saving draft')
        })
    } catch (error) {
        toast.error(error.message || error.error || 'Error saving draft')
    }

}

const saveExistingDraft = async() => {
    let url = `${process.env.VUE_APP_SERVER_URL}/blog/edit/` + editingPostId.value
    let config = {
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
    }

    let data = {
        title: editingPostTitle.value,
        content: editingPostText.value,
        metaTitle: editingPostMetaTitle.value,
        metaDescription: editingPostMetaDescription.value,
        metaKeywords: editingPostMetaKeywords.value,
        excerpt: editingPostExcerpt.value,
        site: editingPostSites.value,
        featuredImage: editingPostFeaturedImage.value,
        subDirectory: editingPostLocation.value,
        status: editingPostStatus.value,
        header: editingPostHeader.value,
        sidebar: sidebar.value,
        tags: editingPostTags.value
    }

    try {
        await fetch(url, {
            method: 'PUT',
            headers: config.headers,
            credentials: 'include',
            body: JSON.stringify(data)
        }).then(async (response) => {
            if (response.status !== 200) {
                throw new Error('Network error- could not save draft')
            }
            toast.success('Draft saved')
            localStorage.setItem('posts', '')
            posts.value = await getPosts()
        }).catch((error) => {
            toast.error(error.message || error.error || 'Error saving draft')
        })
    } catch (error) {
        toast.error(error.message || error.error || 'Error saving draft')
    }
}

</script>

<template>
    <Editor v-if="doing === 'new' || doing === 'editing'"  :modelValue="editingPostText" @update:modelValue="editingPostText = $event"/>
    <div v-if="doing === 'new' || doing === 'editing'">
        <h2 class="text-center text-2xl text-text-1 px-4 pt-4">Metadata</h2>
        <form class = "flex gap-4 flex-wrap items-start p-4">
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="title" class="text-text-1">Title</label>
                <input type="text" name="title" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300 w-full" v-model="editingPostTitle" placeholder="Title">
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="metaTitle" class="text-text-1">Meta Title</label>
                <input type="text" name="metaTitle" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300 w-full" v-model="editingPostMetaTitle" placeholder="Meta Title">
            </div>
            
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="metaKeywords" class="text-text-1">Meta Keywords</label>
                <input type="text" name="metaKeywords" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300 w-full" v-model="editingPostMetaKeywords" placeholder="Meta Keywords">
            </div>
            
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="location" class="text-text-1">Location</label>
                <input type="text" name="location" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300 w-full" v-model="editingPostLocation" placeholder="/">
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="sidebar" class="text-text-1">Sidebar</label>
                <input type="checkbox" name="sidebar" v-model="sidebar" class="cursor-pointer scale-150"/>
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="author" class="text-text-1">Author</label>
                <input readonly type="text" name="author" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 w-full" :value="author.displayName" placeholder="">
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="header" class="text-text-1">Header</label>
                <select name="header" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-500 focus:ring-3 focus:ring-accent-400 accent-accent-300 w-full h-min" v-model="editingPostHeader">
                    <option v-for="header in headerOptions" :key="header" :value="header">{{header}}</option>
                </select>
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="site" class="text-text-1">Site</label>
                <select name="site" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-500 focus:ring-3 focus:ring-accent-400 accent-accent-300 w-full h-min" v-model="editingPostSites">
                    <option v-for="site in allSites" :key="site" :value="site">{{site}}</option>
                </select>
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2">
                <label for="featuredImage" class="text-text-1">Featured Image</label>
                <input type="text" name="featuredImage" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300 w-full" v-model="editingPostFeaturedImage" placeholder="Featured Image">
            </div>
        </form>

        <form class = "flex gap-4 flex-wrap items-start p-4 min-h-36">
            <div class="flex flex-col grow items-center align-middle gap-2 h-12">
                <label for="excerpt" class="text-text-1">Excerpt</label>
                <textarea  name="excerpt" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300 w-full h-min" v-model="editingPostExcerpt" placeholder="Excerpt">
                </textarea>
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2 h-12">
                <label for="tags" class="text-text-1">Tags</label>
                <select multiple name="tags" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-500 focus:ring-3 focus:ring-accent-400 accent-accent-300 w-full min-h-20" v-model="editingPostTags">
                    <option v-for="tag in tags" :key="tag.name" :value="tag.name">{{tag.name}}</option>
                </select>
            </div>
            <div class="flex flex-col grow items-center align-middle gap-2 h-12">
                <label for="metaDescription" class="text-text-1">Meta Description</label>
                <textarea  name="metaDescription" class="flex-col grow items-center align-middle rounded p-2 bg-backdrop-1 text-text-0 active:ring-2 active:ring-accent-300 focus:ring-3 focus:ring-accent-300 accent-accent-300 w-full h-min" v-model="editingPostMetaDescription" placeholder="Meta Description">
                </textarea>
            </div>
        </form>

        <div class = "flex gap-4 p-4">
            <button v-if = "editingPostStatus === 'new-draft'" @click="doing === 'new' ? saveNewDraft() : saveExistingDraft()" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg   text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 flex items-center">
                <Save class = "pr-2"/>Save draft
            </button>
            <button v-if = "editingPostStatus === 'draft'" @click="publishPost(editingPostId)" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg   text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 flex items-center">
                <Send class = "pr-2"/>Publish
            </button>
            <button v-if = "editingPostStatus === 'draft'" @click="schedulePost(editingPostId)" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg   text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 flex items-center">
                <Clock class = "pr-2"/>Schedule
            </button>
            <button v-if = "editingPostStatus === 'published'" @click="saveExistingDraft()" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg   text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 flex items-center">
                <Save class = "pr-2"/>Save
            </button>
            <button v-if = "editingPostStatus === 'published'" @click="unpublishPost(editingPostId)" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg   text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 flex items-center">
                <CheckCheck class = "pr-2"/>Unpublish
            </button>
            


        </div>

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
                    <td class="border-b-backdrop-800 border-b-2 text-center">{{post.author.displayName}}</td>
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
                            <NotepadText  />
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
    <div  class="fixed z-50 md:bottom-5 md:right-5 scale-75 md:scale-100 bottom-1 right-0 flex gap-4 ">
        <button @click="newPost" class="cursor-pointer bg-accent-600 px-5 py-2 rounded-lg   text-text-0 hover:bg-accent-700 hover:scale-105 transition-all duration-300 flex items-center">
            <PenLine class = "pr-2"/>New post
        </button>
        
        <button @click="listPost" class="cursor-pointer bg-backdrop-0 px-5 py-2 rounded-lg   text-text-0 hover:bg-backdrop-1 hover:scale-105 transition-all duration-300 flex items-center">
            <List class = "pr-2"/>List posts
        </button>
    </div>
</template>

<style scoped>
tr:nth-child(even) {
    background-color: unset;
}

</style>