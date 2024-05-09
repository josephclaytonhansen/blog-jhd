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
    const AllTagSites = process.env.VUE_APP_FRONTEND_PREFIXES
    const newTagSite = ref('')
    const newCategoryName = ref('')
    const AllCategorySites = process.env.VUE_APP_FRONTEND_PREFIXES
    const newCategorySite = ref('')

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
                name: newCategoryName.value,
                site: newCategorySite.value
            })
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not add category')
        }
        toast.success('Category added')
        categories.value = await getCategory()
        newCategoryName.value = ''
        newCategorySite.value = ''
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
                name: newTagName.value,
                site: newTagSite.value
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
                slug: slugify(categories.value.find(category => category._id === id).name),
                site: categories.value.find(category => category._id === id).site
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
                slug: slugify(tags.value.find(tag => tag._id === id).name),
                site: tags.value.find(tag => tag._id === id).site
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
                <h1 class="text-2xl text-text-2  ">Tags</h1>
                <div class = 'flex gap-2'>
                <input v-model="newTagName" type="text" class="bg-backdrop-0 text-text-0 px-2 py-2 rounded-md accent-accent-500 " placeholder="New Tag Name">
                <select v-model="newTagSite" class="bg-backdrop-0 text-text-0 px-2 py-2 rounded-md accent-accent-500">
                    <option v-for="site in AllTagSites" :key="site" :value="site">{{site}}</option>
                </select>
                <button @click="addTag" class="bg-backdrop-1 text-text-0 p-2 rounded-md">Add
                    Tag</button>
                </div>
            </div>
            <table
                class="grow text-text-2 table-auto border-separate border-spacing-0">

                <tr v-for="tag in tags" :key="tag.id" class='flex'>
                    <td class="grow flex gap-1">
                        <input v-model="tag.name" type="text" class = 'bg-backdrop-1 p-2 rounded-md grow w-full accent-accent-500'>
                        <select v-model="tag.site" class="bg-backdrop-1 text-text-0 px-2 py-2 rounded-md accent-accent-500">
                            <option v-for="site in AllTagSites" :key="site" :value="site">{{site}}</option>
                        </select>
                    </td>
                    <td>
                        <button @click="viewTagPosts(tag._id)" class="p-2">
                            <Eye /></button>
                        <button @click="editTag(tag._id)" class="p-2 text-accent-500 hover:text-accent-600 transition-all duration-300">
                            <Save /></button>
                        <button @click="deleteTag(tag._id)" class="p-2 text-red-500 rounded  hover:text-red-600 transition-all duration-300">
                            <Trash /></button>
                    </td>
                </tr>
            </table>
        </div>

        <div class="flex flex-col gap-4 grow">
            <div class="flex flex-row gap-4 items-center justify-between">
                <h1 class="text-2xl text-text-2  ">Categories</h1>
                <div class="flex gap-2">
                <input v-model="newCategoryName" type="text" class="bg-backdrop-0 text-text-0 px-2 py-2 rounded-md accent-accent-500" placeholder="Category name">
                <select v-model="newCategorySite" class="bg-backdrop-0 text-text-0 px-2 py-2 rounded-md accent-accent-500">
                    <option v-for="site in AllCategorySites" :key="site" :value="site">{{site}}</option>
                </select>
                <button @click="addCategory" class="bg-backdrop-1 text-text-0 p-2 rounded-md">Add
                    Category</button>
                </div>
            </div>
            <table
                class="grow text-text-2 table-auto border-separate border-spacing-0 ">

                <tr v-for="category in categories" :key="category.id" class=' flex'>
                    <td class="grow flex gap-1">
                        <input v-model="category.name" type="text" class = 'bg-backdrop-1 p-2 accent-accent-500 rounded-md grow w-full'>
                        <select v-model="category.site" class="bg-backdrop-1 text-text-0 px-2 py-2 rounded-md accent-accent-500">
                            <option v-for="site in AllCategorySites" :key="site" :value="site">{{site}}</option>
                        </select>
                    </td>
                    
                    <td>
                        <button @click="viewCategoryPosts(category._id)" class="p-2">
                            <Eye /></button>
                        <button @click="editCategory(category._id)" class="p-2 text-accent-500 hover:text-accent-600 transition-all duration-300">
                            <Save /></button>
                        <button @click="deleteCategory(category._id)" class="p-2  text-red-500 rounded  hover:text-red-600 transition-all duration-300">
                            <Trash /></button>
                    </td>
                </tr>
            </table>
        </div>
    </div>


</template>
