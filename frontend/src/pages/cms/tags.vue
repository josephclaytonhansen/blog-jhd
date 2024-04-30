<script setup>
    import {
        pinia
    } from '../../main.js'
    import {
        userStore
    } from "../../userStore.js"

    import {
        useRouter
    } from 'vue-router'
    import {
        useToast
    } from "vue-toastification"
    const toast = useToast()
    const router = useRouter()

    import {
        onMounted,
        ref,
        computed
    } from 'vue'

    const loggedInStatus = ref(false)

    const store = userStore(pinia)

    import {
        Save,
        Trash,
        Eye
    } from 'lucide-vue-next'

    const tags = ref([])
    const categories = ref([])

    const newTagName = ref('')
    const newCategoryName = ref('')

    const addCategory = async () => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/category/`, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include',
            body: new URLSearchParams({
                name: newCategoryName.value
            })
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not add category')
        }
        toast.success('Category added')
        categories.value = await getCategory()
        newCategoryName.value = ''
    }

    const deleteCategory = async (id) => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/category/${id}/`, {
            method: 'DELETE',
            headers: config.headers,
            credentials: 'include'
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not delete category')
        }
        toast.success('Category deleted')
        categories.value = await getCategory()
    }

    const addTag = async () => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/tag/`, {
            method: 'POST',
            headers: config.headers,
            credentials: 'include',
            body: new URLSearchParams({
                name: newTagName.value
            })
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not add tag')
        }
        tags.value = await getTags()
        toast.success('Tag added')
        newTagName.value = ''
    }

    const deleteTag = async (id) => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/tag/${id}/`, {
            method: 'DELETE',
            headers: config.headers,
            credentials: 'include'
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not delete tag')
        }
        tags.value = await getTags()
        toast.success('Tag deleted')
    }

    const getTags = async () => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/tag/`, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get tags')
        }
        const data = await response.json()
        return data
    }

    const getCategory = async () => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/category/`, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get categories')
        }
        const data = await response.json()
        return data
    }

    onMounted(async () => {
        store.user ? loggedInStatus.value = true : loggedInStatus.value = false
        if (loggedInStatus.value) {
            tags.value = await getTags()
            categories.value = await getCategory()
        } else {
            toast.info('Your session has expired. Please log in.')
            router.push('/login')
        }
    })

    const slugify = (text) => {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, '') // Trim - from end of text
    }

    const editCategory = async(id) => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/category/${id}/`, {
            method: 'PUT',
            headers: config.headers,
            credentials: 'include',
            body: new URLSearchParams({
                name: categories.value.find(category => category._id === id).name,
                slug: slugify(categories.value.find(category => category._id === id).name)
            })
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not edit category')
        }
        toast.success('Category edited')
        categories.value = await getCategory()
    }

    const editTag = async(id) => {
        let config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + localStorage.token,
            },
            withCredentials: true
        }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/tag/${id}/`, {
            method: 'PUT',
            headers: config.headers,
            credentials: 'include',
            body: new URLSearchParams({
                name: tags.value.find(tag => tag._id === id).name,
                slug: slugify(tags.value.find(tag => tag._id === id).name)
            })
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not edit tag')
        }
        toast.success('Tag edited')
        tags.value = await getTags()
    }

</script>

<template>
    <div class="p-1 md:p-8 flex gap-8 flex-wrap scale-75 md:scale-100 ">
        <div class="flex flex-col gap-4 grow">
            <div class="flex flex-row gap-4 items-center justify-between">
                <h1 class="text-2xl text-slate-400">Tags</h1>
                <div class = 'flex gap-2'>
                <input v-model="newTagName" type="text" class = "bg-slate-600 text-slate-200 px-2 py-2 rounded-md accent-cyan-500 " placeholder="New Tag Name">
                <button @click="addTag" class="bg-slate-700 text-white p-2 rounded-md">Add
                    Tag</button>
                </div>
            </div>
            <table
                class="grow text-slate-400 table-auto border-separate border-spacing-0">

                <tr v-for="tag in tags" :key="tag.id" class='flex'>
                    <td class="grow">
                        <input v-model="tag.name" type="text" class = 'bg-slate-700 p-2 rounded-md grow w-full accent-cyan-500'>
                    </td>
                    <td>
                        <button @click="viewTagPosts(tag._id)" class="p-2">
                            <Eye /></button>
                        <button @click="editTag(tag._id)" class="p-2 text-cyan-500 hover:text-cyan-600 transition-all duration-300">
                            <Save /></button>
                        <button @click="deleteTag(tag._id)" class="p-2 text-red-500 rounded  hover:text-red-600 transition-all duration-300">
                            <Trash /></button>
                    </td>
                </tr>
            </table>
        </div>

        <div class="flex flex-col gap-4 grow">
            <div class="flex flex-row gap-4 items-center justify-between">
                <h1 class="text-2xl text-slate-400">Categories</h1>
                <div class = "flex gap-2">
                <input v-model="newCategoryName" type="text" class = "bg-slate-600 text-slate-200 px-2 py-2 rounded-md accent-cyan-500" placeholder="Category name">
                <button @click="addCategory" class="bg-slate-700 text-white p-2 rounded-md">Add
                    Category</button>
                </div>
            </div>
            <table
                class="grow text-slate-400 table-auto border-separate border-spacing-0 ">

                <tr v-for="category in categories" :key="category.id" class=' flex'>
                    <td class="grow">
                        <input v-model="category.name" type="text" class = 'bg-slate-700 p-2 accent-cyan-500 rounded-md grow w-full'>
                    </td>
                    
                    <td>
                        <button @click="viewCategoryPosts(category._id)" class="p-2">
                            <Eye /></button>
                        <button @click="editCategory(category._id)" class="p-2 text-cyan-500 hover:text-cyan-600 transition-all duration-300">
                            <Save /></button>
                        <button @click="deleteCategory(category._id)" class="p-2  text-red-500 rounded  hover:text-red-600 transition-all duration-300">
                            <Trash /></button>
                    </td>
                </tr>
            </table>
        </div>
    </div>


</template>
