<script setup>
    import {pinia} from '../../main.js'
    import {userStore} from "../../userStore.js"

    import { onMounted, ref, computed } from 'vue'

    const loggedInStatus = ref(false)
    import { useToast } from "vue-toastification"
    const toast = useToast()

    import { useRouter } from 'vue-router'
    const router = useRouter()

    const store = userStore(pinia)

    import {
        Flag,
        FlagOff,
        Trash,
        Eye,
        MessageCircleReply,
        EyeOff,
    } from 'lucide-vue-next'

    const comments = ref([])
    const users = ref([])
    const blogPosts = ref({})

    const getUsers = async () => {
        let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/user`, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include',
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get users')
        }
        const data = await response.json()
        return data
    }

    const getComments = async () => {
        let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/comment/`, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get comments')
        }
        const data = await response.json()
        return data
    }

    const flagComment = async (id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/flag/` + id
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
                method: 'PUT',
                headers: config.headers,
                credentials: 'include'
            }).then(async (response) => {
                if (response.status !== 200) {
                    throw new Error('Network error- could not flag comment')
                }
                toast.success('Comment flagged')
                comments.value = await getComments()
            }).catch(async (error) => {
                toast.error(error.message || error.error || 'Error flagging comment')
            })
        } catch (error) {
            toast.error(error.message || error.error || 'Error flagging comment')
        }
    }

    const deleteComment = async (id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/delete/` + id
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
                    toast.error('Error deleting comment')
                    comments.value = getComments()
                    throw new Error('Network error- could not delete comment')
                }
                toast.success('Comment deleted')
                comments.value = await getComments()
            }).catch((error) => {
                toast.error(error.message || error.error || 'Error deleting comment')
            })
        } catch (error) {
            toast.error(error.message || error.error || 'Error deleting comment')
        }
    }

    const unflagComment = async (id) => {
        let url = `${process.env.VUE_APP_SERVER_URL}/comment/unflag/` + id
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
                method: 'PUT',
                headers: config.headers,
                credentials: 'include'
            }).then(async (response) => {
                if (response.status !== 200) {
                    throw new Error('Network error- could not unflag comment')
                }
                toast.success('Comment unflagged')
                comments.value = await getComments()
            }).catch(async (error) => {
                toast.error(error.message || error.error || 'Error unflagging comment')
            })
        } catch (error) {
            toast.error(error.message || error.error || 'Error unflagging comment')
        }
    }

    onMounted(async () => {
        store.user ? loggedInStatus.value = true : loggedInStatus.value = false
        if (loggedInStatus.value){
            comments.value = await getComments()
            users.value = await getUsers()
            blogPosts.value = await getBlogPosts()
        } else {
            toast.info('Your session has expired. Please log in.')
            router.push('/login')
        }
    })

    const findCommentUser = (id) => {
        let user = users.value.find(user => user._id === id)
        return user ? user.displayName : 'Unknown'
    }

    const getBlogPosts = async () => {
        let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + localStorage.token,
        },
        withCredentials: true
    }
        const response = await fetch(`${process.env.VUE_APP_SERVER_URL}/blog/`, {
            method: 'GET',
            headers: config.headers,
            credentials: 'include'
        })
        if (response.status !== 200) {
            toast.error('Network error')
            throw new Error('Network error- could not get blog posts')
        }
        const data = await response.json()
        return data
    }
    const findBlogPostTitle = (id) => {
        let post = blogPosts.value.find(post => post._id === id)
        return post ? post.title : 'Unknown'
    }

    const getBlogPostSlug = (id) => {
        let post = blogPosts.value.find(post => post._id === id)
        return post ? post.slug : ''
    }

</script>

<template>
    <div class = "p-1 md:p-8 flex gap-4 flex-wrap">
        <div class = "min-w-[30%] grow" v-for="comment in comments">
            <div class = "bg-slate-800 text-slate-200 8 m-w-[500px] w-full h-auto m-auto rounded-xl drop-shadow-2xl shadow-md p-4">
                <p class = "italic">{{comment.content}}</p>
                <p >Posted by: {{findCommentUser(comment.user)}}</p>
                <p >Posted on: <router-link :to="'/blog/' + getBlogPostSlug(comment.blogPost)">{{findBlogPostTitle(comment.blogPost)}}</router-link></p>
                <div class = "flex gap-7 mt-2 items-center justify-between w-full">
                    <div class = "flex gap-2 items-center">
                    <button v-if="!comment.flagged" @click="flagComment(comment.id)" class = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        <Flag />
                    </button>
                    <button v-else @click="unflagComment(comment.id)" class = "bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                        <FlagOff />
                    </button>
                    <button @click="deleteComment(comment.id)" class = "bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                        <Trash />
                    </button>
                    <Eye v-if = "!comment.visible"/>
                    <EyeOff v-else/>
                </div>
                    <div class = "flex gap-2">
                        <MessageCircleReply/><span>{{comment.replies?.length? comment.replies.length : '0'}}</span>
                    </div>
                    </div>
            </div>
        </div>
    </div>
    
</template>